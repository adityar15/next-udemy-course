

export default function ProgressBar({complete}) {


    return (
        <div className="bg-gray-700 w-full h-5 rounded-lg">
            <div style={{width: complete + '%'}} className={`bg-sky-400 h-full`}>

            </div>
        </div>
    )
}
