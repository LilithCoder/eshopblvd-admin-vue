/* eslint-disable no-undef */
/* eslint-disable indent */
export const BASE_URL = 'http://localhost:88/api'

export const request = (path, method = 'GET', data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: BASE_URL + path,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            type: method,
            data: data,
            success: data => {
                resolve(data)
            },
            error: err => {
                reject(err)
            }
        })
    })
}
