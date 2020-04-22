import axios from 'axios'

export let commonHeaders = {}
const resource = (url, serverType) => {

  const makeUrl = (queryParam, method) => {
    let resultUrl
    const {id, ...res} = queryParam

    if (res._host)
      resultUrl = res._host
    else {
      if (serverType) {
        if (serverType === 'cloudMain')
          resultUrl = global.cloudMain
        if (serverType === 'cloudRes')
          resultUrl = global.cloudRes
      }
      if (!serverType)
        resultUrl = global.schoolHost
    }

    if (!resultUrl.includes('http://'))
      resultUrl = `http://${resultUrl}`
    resultUrl += url

    if (method === 'get') {
      // 当有id参数,并且参数值中不包含逗号时, 将该参数加入url中
      if (id && !id.toString().includes(','))
        resultUrl += `/${parseInt(id, 10)}`
    }

    // 当有 _type 参数, 并且verb为post时, 将该参数加入url中
    if (queryParam && queryParam._type && method === 'post') {
      resultUrl = `${resultUrl}?_type=${queryParam._type}`
    }

    if (method === 'delete') {
      let _data = Array.isArray(queryParam) ? queryParam : [queryParam]
      resultUrl = `${resultUrl}/${_data.join(',')}`
    }

    // 给 commonHeaders  Accept 中增加 text/回头ml
    commonHeaders.Accept = 'text/回头ml,application/json, text/plain, */*'

    // 如果 originUrl 为 /api/login时, 移除 commonHeaders 中的 dbname
    if (url === '/api/login') delete commonHeaders.dbname
    return resultUrl
  }

  return {
    post: (data, header = {}) => {
      if (header['_host'])
        data['_host'] = header['_host']
      const getUrl = makeUrl(data, 'post')
      if (header && data._header) {
        Object.assign(header, data._header)
      }
      return axios.post(
        getUrl,
        data,
        // {headers: Object.assign({'Content-Type': 'application/json; charset=UTF-8'}, commonHeaders, header)}
      ).then(({data}) => {
        return data
      })
        .catch(err => {
          console.log(err)
          throw err
        })
    },
    get: (data = {}, header = {}) => {
      const getUrl = makeUrl(data, 'get')
      if (header && data._header) {
        Object.assign(header, data._header)
      }
      const {id, _host, ...res} = data
      console.log(id, _host)
      return axios.get(
        getUrl, {params: res || {}},
        {headers: Object.assign({}, commonHeaders, header)}
      )
        .then(({data}) => data)
        .catch(err => {
          console.log(err)
          throw err
        })
    },
    remove: (data = {}, header = {}) => {
      const getUrl = makeUrl(data, 'delete')
      if (header && data._header) {
        Object.assign(header, data._header)
      }
      return axios.delete(getUrl, {headers: Object.assign({}, commonHeaders, header)})
        .then(({data}) => data)
        .catch(err => {
          console.log(err)
          throw err
        })
    }
  }
}
export default resource

export const AuthResource = resource('/api/login', 'cloudMain')
export const SchoolInfoResource = resource('/api/schoolinfo', 'cloudMain')
export const UserInfoResource = resource('/api/users', 'cloudMain')
export const CloudResResource = resource('/cloud/api/textbook', 'cloudRes')
export const CloudSchoolInfoResource = resource('/cloud/api/schoolinfo', 'cloudMain')