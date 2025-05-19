export type PasswordStrength = "weak" | "medium" | "strong" | "very-strong"

export function getPasswordStrength(password: string): {
  strength: PasswordStrength
  score: number
  feedback: string[]
} {
  // Initialize score and feedback
  let score = 0
  const feedback: string[] = []

  // Check password length
  if (password.length === 0) {
    return { strength: "weak", score: 0, feedback: ["Password is required"] }
  } else if (password.length < 8) {
    feedback.push("Password should be at least 8 characters")
  } else {
    score += 1
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    feedback.push("Add uppercase letters")
  } else {
    score += 1
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    feedback.push("Add lowercase letters")
  } else {
    score += 1
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    feedback.push("Add numbers")
  } else {
    score += 1
  }

  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push("Add special characters")
  } else {
    score += 1
  }

  // Additional points for length
  if (password.length >= 12) {
    score += 1
  }
  if (password.length >= 16) {
    score += 1
  }

  // Determine strength based on score
  let strength: PasswordStrength = "weak"
  if (score >= 7) {
    strength = "very-strong"
  } else if (score >= 5) {
    strength = "strong"
  } else if (score >= 3) {
    strength = "medium"
  }

  return { strength, score, feedback }
}
