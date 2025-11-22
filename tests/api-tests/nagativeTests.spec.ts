import { test } from '../../utils/fixtures'
import { expect } from '../../utils/custom-expect'

const usernameTestData = [
    { username: 'qq', userErrorMessage: 'is too short (minimum is 3 characters)' },
    { username: 'qqq', userErrorMessage: '' },
    { username: 'qqqqqqqqqqqqqqqqqqqq', userErrorMessage: '' },
    { username: 'qqqqqqqqqqqqqqqqqqqqq', userErrorMessage: 'is too long (maximum is 20 characters)' },
]

usernameTestData.forEach(({ username, userErrorMessage }) => {
    test(`Error message validation for username: ${username}`, async ({ api }) => {
        const newUserResponse = await api
            .path('/users')
            .body({
                user: {
                    email: 'test@test.com',
                    password: 'test',
                    username
                }
            })
            .clearAuth()
            .postRequest(422)

        if (username.length == 3 || username.length == 20) {
            expect(newUserResponse.errors).not.toHaveProperty('username')
        } else {
            expect(newUserResponse.errors.username[0]).shouldEqual(userErrorMessage)
        }
    })
})

const passwordTestData = [
    { password: 'qqqqqq', userErrorMessage: 'is too short (minimum is 8 characters)' },
    { password: 'qqqqqqqq', userErrorMessage: '' },
    { password: 'qqqqqqqqqqqqqqqqqqqq', userErrorMessage: '' },
    { password: 'qqqqqqqqqqqqqqqqqqqqq', userErrorMessage: 'is too long (maximum is 20 characters)' },
]

passwordTestData.forEach(({ password, userErrorMessage }) => {
    test(`Error message validation for password: ${password}`, async ({ api }) => {
        const newUserResponse = await api
            .path('/users')
            .body({
                user: {
                    email: 'test@test.com',
                    password,
                    username: 'test'
                }
            })
            .clearAuth()
            .postRequest(422)

        if (password.length == 8 || password.length == 20) {
            expect(newUserResponse.errors).not.toHaveProperty('password')
        } else {
            expect(newUserResponse.errors.password[0]).shouldEqual(userErrorMessage)
        }
    })
})

const emailTestData = [
    { email: 'q', userErrorMessage: 'is invalid' },
]

emailTestData.forEach(({ email, userErrorMessage }) => {
    test(`Error message validation for email: ${email}`, async ({ api }) => {
        const newUserResponse = await api
            .path('/users')
            .body({
                user: {
                    email: email,
                    password: "test",
                    username: 'test'
                }
            })
            .clearAuth()
            .postRequest(422)

        expect(newUserResponse.errors.email[0]).shouldEqual(userErrorMessage)

    })
})

