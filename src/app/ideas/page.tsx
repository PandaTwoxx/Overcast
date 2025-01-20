import queryDatabase from '@/api/query';

export default async function Ideas() {
    const query = 'SELECT * FROM users';
    const rows = await queryDatabase(query);
    return (
        <>
            <div>
                <h1>Users</h1>
                <ul>
                    {rows.rows.map((row, index: number) => (
                        <li key={index}>
                            {JSON.stringify(row)} {/* Render each row as a string (or customize the display) */}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}