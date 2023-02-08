export default function Box({title, children}) {
    return (
        <div className='flex-auto w-2/3 mx-auto'>
            { title && <h3 className='text-lg mb-3'>{ title }</h3>}
            <div className='p-6 rounded' style={{background: '#18181b'}}>
                { children }
            </div>
        </div>
    )
}