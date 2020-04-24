// import store from './index'
import find from 'lodash/find'
import gradeDic from '../local-dic/grade'
import subjectDic from '../local-dic/subject'
import _ from 'lodash'
import remove from 'lodash/remove'
import cloneDeep from 'lodash/cloneDeep'
import schoolstageDic from '../local-dic/schoolstage'


// 处理课程
const courseListManage = (stage, courseList) => {
  // 年级-学科-课程
  stage.grades.forEach(grade => {
    grade.subjects.forEach(subject => {
      subject.courseList = _(courseList)
        .filter(course => course.id && course.subject === subject.id && (course.grades.length && _.find(course.grades, {grade: grade.id})))
        .map(course => course.id)
        .value()

      if (!subject.courseList.length)
        subject.courseList.push(0)
    })

    grade.subjects = [...grade.subjects]
  })

  // 学科-年级-课程
  stage.subjects.forEach(subject => {
    subject.grades.forEach(grade => {
      grade.courseList = _(courseList)
        .filter(course => course.id && course.subject === subject.id && (course.grades.length && _.find(course.grades, {grade: grade.id})))
        .map(course => course.id)
        .value()

      if (!grade.courseList.length)
        grade.courseList.push(0)
    })

    subject.grades = [...subject.grades]
  })

  stage.grades = [...stage.grades]
  stage.subjects = [...stage.subjects]
}

// 过滤 bookInfos；高中全部教材书都可以使用，小学初中优先使用学校设置的那本，即school有值
// const filterBookInfos = (tmpBookInfo) => {
//   let filterBooks = []
//   let subgradeBookInfos = _.groupBy(tmpBookInfo, 'subgrade')
//   _.each(subgradeBookInfos, _tmpBooks => {
//     if (!!_.find(_tmpBooks, a => a.school))
//       filterBooks = [...filterBooks, ..._.filter(_tmpBooks,a => a.school)]
//     else
//       filterBooks = [...filterBooks, ..._tmpBooks]
//   })
//
//   return filterBooks
// }

const state = {
  stageGradeSubject:[]
}
const mutations = {

  RECEIVED_TEXTBOOKS:function (state, param) {
    const {textbooks:textBooks} = param.textbookList
    let { schoolInfo, schools: schoolList} = param
    let courseList = []

    // 统一处理 年级学科名称
    textBooks.forEach(item => {
      let grade = find(gradeDic, {id: item.grade})
      item.gradeName = grade.name
      let subject = find(subjectDic, {id: item.subject})
      item.subjectName = subject.name
      item.subjectOrder = subject.order
    })

    // 从教材得到学段年级学科信息(学段1,2,3)
    let stageGradeSubject = _(textBooks)
      .map(item => ({id: item.schoolstage}))
      .uniqBy('id')
      .map(schoolstage => {
        schoolstage.name = find(schoolstageDic, {id: schoolstage.id}).name
        let tmpSchoolstages = textBooks.filter(item => item.schoolstage === schoolstage.id)

        // 年级-学科
        let grades = _(tmpSchoolstages)
          .map(item => ({
            id: item.grade,
            name: item.gradeName,
            editionVersions: _(tmpSchoolstages)
              .filter(o => o.grade === item.grade)
              .map(o => o.bookInfo.editionVersion)
              .uniq()
              .value()
          }))
          .uniqBy('id')
          .map(grade => {
            let textBookArr = tmpSchoolstages.filter(textBook => grade.id === textBook.grade)
            grade.subjects = _(textBookArr)
              .map(textBook => {
                return {
                  id: textBook.subject,
                  name: textBook.subjectName,
                  order:textBook.subjectOrder,
                  editionVersions: _(textBookArr)
                    .filter(o => o.subject === textBook.subject)
                    .map(o => o.bookInfo.editionVersion)
                    .uniq()
                    .value()
                }
              })
              .uniqBy('id')
              .sortBy('order')
              .map(o => {

                let tmpBookInfo = _(tmpSchoolstages)
                  .filter(a => a.subject === o.id && a.grade === grade.id)
                  .map(a => {
                    let {bookInfo,...res} = a
                    Object.assign(bookInfo,{})

                    return res
                  })
                  .uniqBy('id')
                  .value()
                //
                // // 高中全部教材书都可以使用，小学初中优先使用学校设置的那本，即textBookSchool有值
                // let filterBooks = []
                // if ([10, 11, 12].includes(grade.id))
                //   filterBooks = tmpBookInfo
                // else
                //   filterBooks = filterBookInfos(tmpBookInfo)
                //

                // 教材 优先 使用学校设置的，再退化云端的
                // let filterBooks = _.filter(tmpBookInfo,a => a.school)
                // if(!filterBooks.length)
                //   filterBooks = _.filter(tmpBookInfo,a => !a.school)

                // 上册使用的书
                let subgrade_1 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 1)
                if(!subgrade_1.length)
                  subgrade_1 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 0)
                if(!subgrade_1.length)
                  subgrade_1 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 1)
                if(!subgrade_1.length)
                  subgrade_1 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 0)

                // 下册使用的书
                let subgrade_2 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 2)
                if(!subgrade_2.length)
                  subgrade_2 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 0)
                if(!subgrade_2.length)
                  subgrade_2 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 2)
                if(!subgrade_2.length)
                  subgrade_2 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 0)

                return {
                  ...o,
                  textBookInfo: [...subgrade_1,...subgrade_2]
                }
              })
              .value()

            return grade
          })
          .sortBy('id')
          .value()

        // 学科-年级
        let subjects = _(tmpSchoolstages)
          .map(item => {
            return {
              id: item.subject,
              name: item.subjectName,
              order:item.subjectOrder,
              editionVersions: _(tmpSchoolstages)
                .filter(o => o.subject === item.subject)
                .map(o => o.bookInfo.editionVersion)
                .uniq()
                .value()
            }
          })
          .uniqBy('id')
          .map(subject => {
            subject.grades = _(tmpSchoolstages)
              .filter(o => o.subject === subject.id)
              .map(textBook => {
                return {
                  id: textBook.grade,
                  name: textBook.gradeName,
                  editionVersions: _(tmpSchoolstages)
                    .filter(o => (o.subject === subject.id && o.grade === textBook.grade))
                    .map(o => o.bookInfo.editionVersion)
                    .uniq()
                    .value()
                }
              })
              .uniqBy('id')
              .sortBy('id')
              .map(g => {
                let tmpBookInfo = _(tmpSchoolstages)
                  .filter(a => a.subject === subject.id && a.grade === g.id)
                  .map(o => {
                    let {bookInfo,...res} = o
                    Object.assign(bookInfo,{})
                    return res
                  })
                  .uniqBy('id')
                  .value()

                // // 高中全部教材书都可以使用，小学初中优先使用学校设置的那本，即textBookSchool有值
                // let filterBooks = []
                // if ([10, 11, 12].includes(g.id)) {
                //   filterBooks = tmpBookInfo
                // }
                // else
                //   filterBooks = filterBookInfos(tmpBookInfo)

                // 教材 优先 使用学校设置的，再退化云端的
                // let filterBooks = _.filter(tmpBookInfo,a => a.school)
                // if(!filterBooks.length)
                //   filterBooks = _.filter(tmpBookInfo,a => !a.school)

                // 上册使用的书
                let subgrade_1 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 1)
                if(!subgrade_1.length)
                  subgrade_1 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 0)
                if(!subgrade_1.length)
                  subgrade_1 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 1)
                if(!subgrade_1.length)
                  subgrade_1 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 0)

                // 下册使用的书
                let subgrade_2 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 2)
                if(!subgrade_2.length)
                  subgrade_2 = _.filter(tmpBookInfo,a => a.school && a.subgrade === 0)
                if(!subgrade_2.length)
                  subgrade_2 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 2)
                if(!subgrade_2.length)
                  subgrade_2 = _.filter(tmpBookInfo,a => !a.school && a.subgrade === 0)

                return {
                  ...g,
                  textBookInfo: [...subgrade_1,...subgrade_2]
                }
              })
              .value()

            return subject
          })
          .sortBy('order')
          .value()

        return {...schoolstage, grades, subjects, includesStage: [schoolstage.id]}
      })
      .sortBy('id')
      .value()

    let schoolStageIds = []
    schoolList.forEach(item => {
      schoolStageIds = [...schoolStageIds, ...item.schoolstage.split(',')]
    })

    schoolStageIds = [...new Set(schoolStageIds.map(o => parseInt(o, 10)))]

    stageGradeSubject.forEach(schoolstageItem => remove(schoolStageIds,
      tId => tId === schoolstageItem.id))

    // 多余学段(9,10,11)  单独处理 年级学科
    if (schoolStageIds.length) {

      // 九年制、完中、十二年制 重新生成年级学科
      let makeGradeSubject = (stageId, stageGradeSubject) => {
        // 由 低学段 拼接成相应的年级学科
        let tmpStages = [stageId]
        if (stageId === 9)
          tmpStages = [1, 2]
        if (stageId === 10)
          tmpStages = [2, 3]
        if (stageId === 11)
          tmpStages = [1, 2, 3]

        let grades = []
        let subjects = []

        // 九年制、完中、十二年制 重新生成年级学科
        if([9,10,11].includes(stageId)) {
          tmpStages.forEach(tId => {
            let stageItem = stageGradeSubject.find(o => o.id === tId)
            grades = [...grades, ...(cloneDeep(stageItem.grades))]
            stageItem.subjects.forEach(subject => {
              let tmpSubject = subjects.find(o => o.id === subject.id)
              if (tmpSubject)
                tmpSubject.grades = [...tmpSubject.grades, ...(cloneDeep(subject.grades))]
              else
                subjects.push(cloneDeep(subject))
            })
          })

          // 学科下 年级去重
          subjects.forEach(subject => {
            subject.grades = _(subject.grades).uniqBy('id').value()
          })
        }

        return {grades, subjects:_.sortBy(subjects,'order'), includesStage: tmpStages}
      }

      //多余学段 生成 学段-年级-学科 树形结构
      let moreStages = schoolStageIds.map(stageId => {
        let findStage = schoolstageDic.find(item => item.id === stageId)
        let gradeAndSubjects = makeGradeSubject(stageId, stageGradeSubject)

        return {
          id: stageId,
          name: findStage.name,
          ...gradeAndSubjects,
        }
      })

      stageGradeSubject = [...stageGradeSubject, ...moreStages]
    }

    // 课程挂靠相应年级学科下，教育局所有学段，学校 只挂靠在学校所处学段下
    let courseStages = schoolInfo.type === 6 ? stageGradeSubject : stageGradeSubject.filter(item => item.id === parseInt(schoolInfo.schoolstage, 10))

    courseStages.forEach(stageItem => {
      courseListManage(stageItem, courseList)

    })

    let currentSchoolStage = find(stageGradeSubject, {id: parseInt(schoolInfo.schoolstage, 10)})
    if (currentSchoolStage)
      currentSchoolStage.state = 1

    state.stageGradeSubject = stageGradeSubject
  }
}
const actions = {

}
const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}