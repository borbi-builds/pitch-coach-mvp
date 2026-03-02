/**
 * Claude Argument Structure Analysis Engine (Real API)
 * Analyzes transcript for: thesis clarity, logic flow, evidence strength, persuasion
 * Returns: clarity score, flow score, evidence score, persuasion score
 */

import Anthropic from "@anthropic-ai/sdk";

export interface ClaudeAnalysisResult {
  thesisClarityScore: number; // 0-100
  logicFlowScore: number; // 0-100
  evidenceStrengthScore: number; // 0-100
  persuasionScore: number; // 0-100
  overallArgumentScore: number; // 0-100
  thesisStatement: string;
  argumentStructure: {
    hasOpener: boolean;
    problemStatementTimestamp: number | null;
    solutionStatementTimestamp: number | null;
    evidencePoints: {
      type: "statistic" | "case_study" | "anecdote";
      content: string;
      timestamp: number;
    }[];
    hasClosing: boolean;
  };
  emotionalConnection: number; // 0-100
  uniqueValueProposition: string;
  weaknesses: string[];
  strengths: string[];
}

export async function analyzeArgumentStructure(
  transcript: string
): Promise<ClaudeAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const client = new Anthropic({ apiKey });

  const analysisPrompt = `Analyze this pitch transcript for argument structure, clarity, and persuasiveness. 
Return a JSON object with:
{
  "thesisClarityScore": 0-100,
  "logicFlowScore": 0-100,
  "evidenceStrengthScore": 0-100,
  "persuasionScore": 0-100,
  "overallArgumentScore": 0-100,
  "thesisStatement": "one sentence summary of the main thesis",
  "argumentStructure": {
    "hasOpener": boolean,
    "problemStatementTimestamp": seconds or null,
    "solutionStatementTimestamp": seconds or null,
    "evidencePoints": [
      {"type": "statistic|case_study|anecdote", "content": "...", "timestamp": seconds}
    ],
    "hasClosing": boolean
  },
  "emotionalConnection": 0-100,
  "uniqueValueProposition": "one sentence",
  "weaknesses": ["weakness 1", "weakness 2"],
  "strengths": ["strength 1", "strength 2"]
}

Transcript:
${transcript}`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Claude response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      thesisClarityScore: analysis.thesisClarityScore || 80,
      logicFlowScore: analysis.logicFlowScore || 80,
      evidenceStrengthScore: analysis.evidenceStrengthScore || 75,
      persuasionScore: analysis.persuasionScore || 75,
      overallArgumentScore: analysis.overallArgumentScore || 77,
      thesisStatement:
        analysis.thesisStatement || "Unable to extract thesis statement",
      argumentStructure: {
        hasOpener: analysis.argumentStructure?.hasOpener ?? true,
        problemStatementTimestamp:
          analysis.argumentStructure?.problemStatementTimestamp ?? null,
        solutionStatementTimestamp:
          analysis.argumentStructure?.solutionStatementTimestamp ?? null,
        evidencePoints: analysis.argumentStructure?.evidencePoints ?? [],
        hasClosing: analysis.argumentStructure?.hasClosing ?? true,
      },
      emotionalConnection: analysis.emotionalConnection || 60,
      uniqueValueProposition:
        analysis.uniqueValueProposition || "Unable to extract UVP",
      weaknesses: analysis.weaknesses || [],
      strengths: analysis.strengths || [],
    };
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}
