import {NextResponse} from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
){
    try{
        const body=await req.json();

        const {name}=body;
        const {vId}=body;
        const {userId}=body;
        const {pId}=body;
        const {reels}=body;

        const project=await prismadb.project.create({
            data:{
                name,
                vId,
                userId,
                pId,
                reels
              }
        });

        return NextResponse.json(project);

    }catch(error){
        console.log('[STORES_POST]',error);
        return new NextResponse("Internal Server Error",{status:500});
    }
}

export async function GET(
    req:Request,
){
    try{
        const projects= await prismadb.project.findMany();
        return NextResponse.json(projects);

    }catch(error){
        console.log('[CATEGORIES_GET]',error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function PUT(req: Request) {
    try {
      const body = await req.json();
      const { id } = body; // Assuming you pass the projectId to update
  
      const updatedProject = await prismadb.project.update({
        where: {
          id: id,
        },
        data: {
          approvalStatus: true,
        },
      });
  
      return NextResponse.json(updatedProject);
    } catch (error) {
      console.log('[CATEGORIES_PUT]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }