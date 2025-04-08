import './loading.css'


export default function Loading() {

    return (
              <div className='absolute w-full z-50 h-full  flex flex-col justify-center items-center bg-gray-100'>
              <svg viewBox="25 25 50 50" className='loading'>
          <circle r="20" cy="50" cx="50" className='rot'></circle>
        </svg>
        <h1 className='text-xl ml-4'>loading ...</h1>
              </div>
    )
}