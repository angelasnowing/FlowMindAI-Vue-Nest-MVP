import {Body,Controller,Get,Param,Patch,Post} from '@nestjs/common';import {PrismaService} from './prisma.service';
@Controller() export class AppController{constructor(private db:PrismaService){}
@Get('dashboard') async dashboard(){return this.db.user.findFirst({include:{goals:{include:{tasks:true}},profile:true,focusRecords:true}})}
@Post('plans') async plan(@Body() b:{title:string}){let user=await this.db.user.findFirst();if(!user)user=await this.db.user.create({data:{nickname:'Sherry'}});const goal=await this.db.goal.create({data:{userId:user.id,title:b.title,description:`围绕“${b.title}”制定的 3 天启动计划`}});const verbs=['澄清目标与验收标准','搭建基础环境并完成最小示例','完成核心任务并复盘'];await this.db.task.createMany({data:verbs.map((v,i)=>({goalId:goal.id,title:`${v}`,estimatedTime:[35,50,45][i],sortOrder:i+1}))});return this.db.goal.findUnique({where:{id:goal.id},include:{tasks:true}})}
@Patch('tasks/:id') task(@Param('id') id:string,@Body() b:{status:string}){return this.db.task.update({where:{id:+id},data:{status:b.status}})}
@Post('focus') async focus(@Body() b:{taskId?:number,duration:number,distractionCount:number,focusScore:number}){const user=await this.db.user.findFirstOrThrow();if(b.taskId)await this.db.task.update({where:{id:b.taskId},data:{status:'DONE'}});return this.db.focusRecord.create({data:{userId:user.id,...b}})}
}
