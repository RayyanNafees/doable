/**
 * Parse natural language task input similar to Super Productivity
 * Supports: @date, +project, #tags, time estimates
 */

interface ParsedTask {
  title: string
  userId: string
  projectId?: string
  dueDate?: Date
  effortEstimateMins?: number
  description?: string
}

export function parseTaskInput(
  input: string,
  userIds: Array<{ _id: string; email: string }>,
  projectIds: Array<{ _id: string; title: string }>
): ParsedTask {
  // Default to first user if available
  const defaultUserId = userIds[0]?._id || ""
  
  let title = input.trim()
  let projectId: string | undefined
  let dueDate: Date | undefined
  let effortEstimateMins: number | undefined
  const tags: string[] = []

  // Extract project (+projectName)
  const projectMatch = title.match(/\+(.+?)(?:\s|$)/)
  if (projectMatch) {
    const projectName = projectMatch[1].trim()
    const project = projectIds.find(
      (p) => p.title.toLowerCase() === projectName.toLowerCase()
    )
    if (project) {
      projectId = project._id
    }
    title = title.replace(/\+(.+?)(?:\s|$)/, "").trim()
  }

  // Extract tags (#tag)
  const tagMatches = title.matchAll(/#(\w+)/g)
  for (const match of tagMatches) {
    tags.push(match[1])
    title = title.replace(/#\w+/g, "").trim()
  }

  // Extract date (@fri 4pm, @tomorrow, @2024-12-25, etc.)
  const dateMatch = title.match(/@(\w+|\d{4}-\d{2}-\d{2})(?:\s+(\d{1,2}(?:am|pm)?))?/i)
  if (dateMatch) {
    const dateStr = dateMatch[1]
    const timeStr = dateMatch[2]
    
    const date = parseDate(dateStr)
    if (date) {
      if (timeStr) {
        const time = parseTime(timeStr)
        if (time) {
          date.setHours(time.hours, time.minutes)
        }
      }
      dueDate = date
    }
    title = title.replace(/@(\w+|\d{4}-\d{2}-\d{2})(?:\s+(\d{1,2}(?:am|pm)?))?/i, "").trim()
  }

  // Extract time estimate (10m, 3h, 1h30m, etc.)
  const timeMatch = title.match(/(\d+)(h|m)(?:\s*(\d+)m)?/)
  if (timeMatch) {
    const hours = timeMatch[2] === "h" ? parseInt(timeMatch[1]) : 0
    const minutes = timeMatch[2] === "m" 
      ? parseInt(timeMatch[1]) 
      : (timeMatch[3] ? parseInt(timeMatch[3]) : 0)
    
    effortEstimateMins = hours * 60 + minutes
    title = title.replace(/(\d+)(h|m)(?:\s*(\d+)m)?/, "").trim()
  }

  return {
    title: title || "Untitled Task",
    userId: defaultUserId,
    projectId,
    dueDate,
    effortEstimateMins,
  }
}

function parseDate(dateStr: string): Date | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lower = dateStr.toLowerCase()

  // Relative dates
  if (lower === "today") return new Date(today)
  if (lower === "tomorrow") {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }

  // Day names
  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  const dayIndex = dayNames.indexOf(lower.slice(0, 3))
  if (dayIndex !== -1) {
    const target = new Date(today)
    const currentDay = today.getDay()
    let daysUntil = dayIndex - currentDay
    if (daysUntil <= 0) daysUntil += 7
    target.setDate(target.getDate() + daysUntil)
    return target
  }

  // ISO date format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr)
  }

  return null
}

function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/(\d{1,2})(am|pm)?/i)
  if (!match) return null

  let hours = parseInt(match[1])
  const period = match[2]?.toLowerCase()

  if (period === "pm" && hours !== 12) hours += 12
  if (period === "am" && hours === 12) hours = 0

  return { hours, minutes: 0 }
}

