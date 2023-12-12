import * as uuid from "uuid";
import {commentsT, newestLikesT, postT, reactionsT, UserAccountDBType, userViewT} from "../Types/types";
import bcrypt from "bcrypt";

export const EntityUtils = {
    CreateUser: async (login, email, password) => {
        const id = uuid.v4()
        const confirmationCode = uuid.v4()
        const createdAt = new Date().toISOString()
        const expirationDate = new Date().toISOString()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const User = {
            id,
            recoveryCode: ''
        }
        const AccountData = {
            userId: id,
            username: login,
            email,
            passwordHash: hash,
            createdAt
        }
        const EmailConfirmation = {
            userId: id,
            confirmationCode,
            expirationDate,
            isConfirmed: false
        }
        const ViewUser = {
            id: User.id,
            email: AccountData.email,
            login: AccountData.username,
            createdAt: AccountData.createdAt
        }

        return {AccountData, EmailConfirmation, ViewUser}
    },
    GetPost: (post: postT, userId, reactions, newestLikes): any => {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likesCount,
                dislikesCount: post.dislikesCount,
                myStatus: reactions.reduce((ac: string, r: reactionsT) => {
                    if (r.userId === userId && r.postId === post.id ) {
                        return r.status
                    }
                    return ac
                }, 'None'),
                newestLikes: newestLikes.map((el: newestLikesT, i: number) => {
                    if (i < 3) {
                        return {
                            userId: el.userId,
                            addedAt: el.addedAt,
                            login: el.login
                        };
                    }
                    return
                }).splice(0, 3)
            }
        }
    },
    CreatePost: (title: string, shortDescription: string,
                 content: string, blogId: string, blogName: string): postT => {
        return {
            id: uuid.v4(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString(),
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
        }
    },
    createViewComment: (comment: commentsT, userId: string) => {
        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.reactions.reduce((ac, r) => {
                    if (r.userId == userId) {
                        ac = r.status;
                        return ac
                    }
                    return ac
                }, 'None')
            }
        }
    },
    createReaction: (userId: string, status: string) => {
        return {
            userId,
            status,
            createdAt: new Date().toISOString()
        }
    },
    createNewestLike: (userId: string, login: string) => {
        return {
            userId,
            login,
            addedAt: new Date().toISOString()
        }
    },
}