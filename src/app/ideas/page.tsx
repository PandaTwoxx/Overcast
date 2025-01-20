import queryDatabase from '@/api/query';

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