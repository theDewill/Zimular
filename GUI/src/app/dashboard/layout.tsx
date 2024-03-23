import React from 'react';


export default async function DashLayout({ 
    user}:{
    user: React.ReactNode
}) {
<<<<<<< HEAD
    const session = await getServerSession();
    if (!session) {
        redirect('/');
    }
=======

>>>>>>> 38b3cb251e07a5a33d51dcf60f7146d784b3da3e
    return (
        <div className=''>
            { user }
        </div>
    )
}
