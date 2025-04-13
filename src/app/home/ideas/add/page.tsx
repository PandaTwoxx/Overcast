import AddPost from '@/components/addPost'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserId } from '@/api/users'

export default async function addingPost() {
    const user = (await auth())?.user
    if (!user) {
        redirect('/login')
    }
    const userId = Number(user.id || (await getUserId(user.name || '')));
    return (
        <AddPost userId={userId} />
    )
}