import './loading.css'


export default function Loading() {

    return (
<div className='fixed top-0 left-0 w-full h-full z-50 flex flex-col justify-center items-center bg-gray-100 bg-opacity-80 backdrop-blur-sm'>
  <svg viewBox="25 25 50 50" className='w-16 h-16 animate-spin loading text-blue-500'>
    <circle r="20" cy="50" cx="50" className='stroke-current rot' />
  </svg>
  <h1 className='text-xl mt-4 text-gray-700'>Loading...</h1>
</div>

    )
}