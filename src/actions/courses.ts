"use server"
import { client } from "@/lib/prisma"
import { v4 } from "uuid"
import { onAuthenticatedUser } from "./auth"

export const onGetGroupCourses = async (groupid: string) => {
  try {
    const courses = await client.course.findMany({
      where: {
        groupId: groupid,
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    })

    if (courses && courses.length > 0) {
      return { status: 200, courses }
    }

    return {
      status: 404,
      message: "No courses found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onCreateGroupCourse = async (
  groupid: string,
  name: string,
  image: string,
  description: string,
  courseid: string,
  privacy: string,
  published: boolean,
) => {
  try {
    const course = await client.group.update({
      where: {
        id: groupid,
      },
      data: {
        courses: {
          create: {
            id: courseid,
            name,
            thumbnail: image,
            description,
            privacy,
            published,
          },
        },
      },
    })

    if (course) {
      return { status: 200, message: "Course successfully created" }
    }

    return { status: 404, message: "Group not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onGetCourseModules = async (courseId: string) => {
  const user = await onAuthenticatedUser()
  try {
    const modules = await client.module.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        section: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            SectionProgress: {
              where: { userId: user.id }, // filter only current user's progress
            },
          },
        },
      },
    })

    if (modules && modules.length > 0) {
      return { status: 200, modules }
    }

    return {
      status: 404,
      message: "No modules found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onCreateCourseModule = async (
  courseId: string,
  name: string,
  moduleId: string,
) => {
  try {
    const courseModule = await client.course.update({
      where: {
        id: courseId,
      },
      data: {
        modules: {
          create: {
            title: name,
            id: moduleId,
          },
        },
      },
    })

    if (courseModule) {
      return { status: 200, message: "Module successfully create" }
    }

    return {
      status: 404,
      message: "No courses found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onUpdateModule = async (
  moduleId: string,
  type: "NAME" | "DATA",
  content: string,
) => {
  try {
    if (type === "NAME") {
      const title = await client.module.update({
        where: {
          id: moduleId,
        },
        data: {
          title: content,
        },
      })

      if (title) {
        return { status: 200, message: "Name successfully updated" }
      }

      return {
        status: 404,
        message: "Module not found!",
      }
    }
  } catch (error) {
    return { status: 400, message: "Something went wrong" }
  }
}

export const onUpdateSection = async (
  sectionId: string,
  type: "NAME" | "COMPLETE",
  content: string,
) => {
  try {
    if (type === "NAME") {
      await client.section.update({
        where: {
          id: sectionId,
        },
        data: {
          name: content,
        },
      })

      return { status: 200, message: "Section successfully updated" }
    }
    // todo: might need user id to show complete equal to true
    if (type === "COMPLETE") {
      await client.section.update({
        where: {
          id: sectionId,
        },
        data: {
          complete: true,
        },
      })

      return { status: 200, message: "Section successfully completed" }
    }

    return { status: 404, message: "Section not found" }
  } catch (error) {
    return { status: 400, message: "Something went wrong!" }
  }
}

export const onCreateUpdateSectionProgress = async (sectionId: string) => {
  try {
    const user = await onAuthenticatedUser()
    if (!user) {
      return { status: 401, message: "Unauthorized" }
    }

    // Upsert SectionProgress for the user and section
    if (!user.id) {
      return { status: 401, message: "Unauthorized" }
    }
    const progress = await client.sectionProgress.upsert({
      where: {
        userId_sectionId: {
          userId: user.id,
          sectionId,
        },
      },
      update: {
        complete: true,
      },
      create: {
        id: v4(),
        userId: user.id,
        sectionId,
        complete: true,
      },
    })

    if (progress) {
      return { status: 200, message: "Progress successfully updated" }
    }

    return { status: 404, message: "Section not found" }
  } catch (error) {
    return { status: 500, message: "Something went wrong!" }
  }
}
export const onCreateModuleSection = async (
  moduleId: string,
  sectionid: string,
) => {
  try {
    const section = await client.module.update({
      where: {
        id: moduleId,
      },
      data: {
        section: {
          create: {
            id: sectionid,
          },
        },
      },
    })

    if (section) {
      return { status: 200, message: "New section created" }
    }

    return { status: 404, message: "Module not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onGetSectionInfo = async (sectionid: string) => {
  try {
    const section = await client.section.findUnique({
      where: {
        id: sectionid,
      },
    })

    if (section) {
      return { status: 200, section }
    }

    return { status: 404, message: "Course section not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}
export const onGetSectionProgressInfo = async (sectionid: string) => {
  const user = await onAuthenticatedUser()
  // console.log("useridd.....",user)
  try {
    const section = await client.section.findUnique({
      where: {
        id: sectionid,
      },
      include: {
        SectionProgress: {
          where: {
            sectionId: sectionid,
            userId: user.id,
          },
        },
      },
    })
    console.log("section progress", section)
    if (section) {
      return {
        status: 200,
        section,
        // : {
        //   ...section,
        //   complete: section?.SectionProgress[0].complete,
        // },
      }
    }

    return { status: 404, message: "Course section not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onUpdateCourseSectionContent = async (
  sectionid: string,
  html: string,
  json: string,
  content: string,
) => {
  try {
    const section = await client.section.update({
      where: {
        id: sectionid,
      },
      data: {
        JsonContent: json,
        htmlContent: html,
        content,
      },
    })

    if (section) {
      return { status: 200, message: "Course content added" }
    }

    return { status: 404, message: "Section not found!" }
  } catch (error) {
    return { status: 400, message: "Oop! something went wrong" }
  }
}
