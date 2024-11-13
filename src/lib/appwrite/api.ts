import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, ImageGravity, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw new Error("Failed to create a new account");

        const avatarUrl = await avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl,
            username: user.username,
        });

        return newUser;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function saveUserToDB({
    accountId,
    email,
    name,
    imageUrl,
    username,
}: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId,
                email,
                name,
                imageUrl,
                username,
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to save user to database");
    }
}

export async function signInAccount(user : {
    email: string;
    password: string;
}) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch(error) {
        console.error('Sign-in error:', error);
        throw new Error('Sign-in failed. Please check your credentials.');
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) {
            throw new Error("No current account session found");
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );


        if (currentUser.documents.length === 0) {
            throw new Error("No user found in database");
        }

        return currentUser.documents[0];
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch(error) {
        console.log(error);
    }
}

//? For creating post 
export async function createPost(post: INewPost) {
    try {
        // Uploading image to storage (appwrite storage)

        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile) throw Error;

        // Getting the file URL

        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        }

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageId: uploadedFile.$id,
                imageUrl: fileUrl,
                location: post.location,
                tags: tags,
            }
        )

        if(!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch(error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )

        return uploadedFile;
    } catch(error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100,
        );

        return fileUrl;
    } catch (error) {
        console.error("Error getting file preview:", error);
        return null;
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return {status: 'ok'}
    } catch(error) {
        console.log(error);
    }
}

// to fetch the recent posts
export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if(!posts) throw Error;

    return posts;
}

//? To udpate likes and save posts
export async function likePost(postId: string, likesArray: string[]) {
    try {
         const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
         )

         if(!updatedPost) throw Error;

         return updatedPost;
    } catch (err) {
        console.log(err);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
         const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                post: postId,
                user: userId,
            }
         )

         if(!updatedPost) throw Error;

         return updatedPost;
    } catch (err) {
        console.log(err);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
         const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
         )

         if(!statusCode) throw Error;

         return {status: 'ok'}
    } catch (err) {
        console.log(err);
    }
}

//? Fetching post data from id
export async function getPostById(postId: string) { 
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return post;
    } catch(error) {
        console.log(error);
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpload = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        };
        
        if (hasFileToUpload) {
            // Upload file to storage
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw new Error("Error uploading file");

            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error("Error generating file URL");
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageId: image.imageId,
                imageUrl: image.imageUrl,
                location: post.location,
                tags: tags,
            }
        );

        if (!updatedPost) {
            await deleteFile(post.imageId);
            throw new Error("Error updating post");
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId: string, imageId: string) {
    if(!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
        )

        return {status: 'ok'};
    } catch(error) {
        console.log(error);
    }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
export async function searchPost({searchItem}:{ searchItem: string}) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchItem)]
          );

        if(!posts) throw Error;

        return posts;
    } catch(error) {
        console.log(error);
    }
}

export async function getUsers() {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.orderDesc("$createdAt")],
        )

        return users;
    } catch(error) {
        console.log(error);
    }
}

export async function getTopCreators() {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.orderDesc('$posts.length')]
        )

        return users;
    } catch(error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )

        if(!user) throw Error;

        return user;
    } catch(error) {
        console.log(error);
    }
}

//? UPDATE USER
export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        }

        if(hasFileToUpdate) {
            const uploadedFile = await uploadFile(user.file[0]);
            if(!uploadedFile) throw Error;

            const fileUrl = getFilePreview(uploadedFile.$id);
            if(!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
            }
        )

        if(!updatedUser) {
            if(hasFileToUpdate) {
                await deleteFile(image.imageId)
            }

            throw Error;
        }

        if(user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;
    } catch(error) {
        console.log(error);
    }
}