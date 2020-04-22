import {UserInfoResource, AuthResource} from './resource'

// 登录请求
export const authLogIn = (param) => {
  const header = param.jwtToken ? {
    Authorization: `Bearer ${param.jwtToken}`,
  } : undefined
  return AuthResource.post(param, header)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export const getUserInfo = (param) => {
  return UserInfoResource.get(param)
    .then(data => {
      return data.user
    })
    .catch(err => console.log(err))
}



