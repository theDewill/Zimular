import {getUI} from '@/utils/mngFetcher' //TODO: this is temporary 
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';


  // Execute your server-side code here

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    let inputs : any[] = [];
    inputs.push(await getUI(1,1,1));
    //console.log(inputs);
    return res.status(200).json({ data : inputs });
  //   return new NextResponse("User Registered Successfully", {
  //     status:200
  // })
}