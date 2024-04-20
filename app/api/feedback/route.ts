import {NextResponse} from "next/server";

import prismadb from "@/lib/prismadb";

export async function PUT(req: Request) {
    try {
      const body = await req.json();
      const { id } = body;
      const {feedback}=body;
      const {pId}=body;
      const {name}=body;
  
      const updatedProject = await prismadb.project.update({
        where: {
          id:id,
        },
        data: {
          feedback: feedback,
        },
      });
  
      return NextResponse.json(updatedProject);
    } catch (error) {
      console.log('[CATEGORIES_PUT]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }