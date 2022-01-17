
import nc from 'next-connect'
import Cors from 'cors'

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
    },
  }

const handler = nc().use(Cors()).post(
    (req, res)=>
{
    res.status(200).json({name: req.query.name})
}
)



export default handler