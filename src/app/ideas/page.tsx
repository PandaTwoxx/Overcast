import queryDatabase from '@/api/voting';

export default async function Ideas() {
    const query = 'SELECT * FROM users';
    const rows = await queryDatabase(query);
    console.log(rows);
    return (
        <>
            {rows}
        </>
    )
}