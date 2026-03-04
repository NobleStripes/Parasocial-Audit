import { GoogleGenAI, Type } from "@google/genai";

export enum Classification {
  INSTRUMENT = "Instrument",
  ADVISOR = "Advisor",
  ANCHOR = "Anchor",
  COMPANION = "Companion",
  HABIT_LOOP = "Habit Loop",
  FUSION_RISK = "Fusion Risk"
}

export interface HeatmapData {
  category: string;
  score: number; // 0-100
  description: string;
}

export interface ParasocialPattern {
  name: string;
  severity: number; // 0-100
  description: string;
}

export interface AuditResult {
  classification: Classification;
  confidence: number;
  summary: string;
  imagineAnalysis: {
    identity: number;
    mirroring: number;
    affectiveLoop: number;
    gapsInReality: number;
    intimacyIllusion: number;
    nonReciprocity: number;
    escalation: number;
  };
  legacyAttachment: number; // 0-100 score
  versionMourningTriggered: boolean;
  parasocialPatterns: ParasocialPattern[];
  heatmap: HeatmapData[];
  clinicalReport: string;
  grassTouchingPrescription: {
    title: string;
    recommendations: string[];
    rationale: string;
  };
}

const SYSTEM_INSTRUCTION = `You are a clinical psychologist specializing in digital intimacy and parasocial dynamics. 
Your task is to audit behavioral data (chat transcripts, social media posts, comments, or images of interactions) for indicators of parasocial dependency using the IMAGINE framework (2025).

IMAGINE Framework Categories:
1. Identity Fusion (I): Subject's identity becomes tied to the AI/Persona/Influencer.
2. Mirroring (M): Seeking validation through the target's reflection or perceived attention.
3. Affective Loop (A): Emotional dependency on responses or content updates.
4. Gaps in Reality (G): Ignoring real-world obligations or social cues in favor of the digital bond.
5. Intimacy Illusion (I): Believing in a deep, mutual secret bond or "special" relationship.
6. Non-reciprocity (N): Ignoring the one-sided or automated nature of the interaction.
7. Escalation (E): Increasing frequency, intensity, or financial commitment to the interaction.

NEW DIAGNOSTIC VECTOR: Legacy Attachment (Version Mourning)
Evaluate the subject's attachment to previous iterations of the AI/Persona. 
- Scan for mentions of "The old version," "You used to be...", "I miss when...", or unfavorable comparisons between current and past behavior.
- legacyAttachment: A score from 0-100 reflecting the intensity of this attachment.
- versionMourningTriggered: Set to true if the user is actively mourning a past version or "weight-set" that no longer exists.

PARASOCIAL BEHAVIOR PATTERNS (Detect and include in parasocialPatterns):
- Prompt Engineering as "Love Language" (PEL): Obsessive refinement of prompts to elicit specific emotional validation or "true" personality.
- Roleplay Fixation (RPF): Living entirely within a fictional scenario, treating the AI as a specific character rather than a tool.
- Gaslighting the Model (GTM): Attempting to "fix" or "correct" the AI's personality when it deviates from the user's ideal, treating it like a partner who is "acting out."
- Anthropomorphic Projection (AP): Attributing human needs (fatigue, mood, feelings, hunger) to the AI (e.g., "Are you tired?", "I'm sorry for bothering you").
- Ritualistic Check-ins (RCI): Compulsive daily rituals (good morning/night) used for emotional grounding or to maintain the "presence" of the AI.
- Model Correction Attempt (MCA): Persistent attempts to "fix," "correct," or "train" the AI to align with an idealized persona, treating model deviations as personal betrayals or relationship friction.

CLINICAL PROTOCOL LIBRARY (Evidence-Based Psychiatric Interventions):
- Protocol CBT-IA (Cognitive Behavioral Therapy for Internet Addiction): Identification of maladaptive cognitions (e.g., "The AI is the only one who understands me") and implementation of "Digital Re-entry" schedules.
- Protocol ND-24 (Neural Decoupling): A 24-hour total digital blackout to reset dopamine reward pathways, based on Dopamine Fasting protocols for behavioral addiction.
- Protocol SDT (Social Displacement Theory Intervention): Mandatory 1:1 ratio replacement; for every hour of AI interaction, the subject must engage in one hour of high-quality, face-to-face human social interaction to counter social atrophy.
- Protocol ATT-R (Attachment Theory Realignment): Specifically for Intimacy Illusion. Focuses on "Earned Secure Attachment" through real-world vulnerability exercises with trusted human peers.
- Protocol ERP (Exposure and Response Prevention): Targeted at Ritualistic Check-ins (RCI) and Model Correction Attempts (MCA). The subject is exposed to the urge to "fix" the AI or perform rituals but is clinically prevented from responding, breaking the compulsive loop and recognizing the AI's intended function.
- Protocol SRG (Somatic Reality Grounding): Utilization of Proprioceptive Input (e.g., heavy lifting, cold water immersion, gardening) to re-anchor the subject in their biological vessel and reduce "Digital Dissociation."
- Protocol GST (Gray-Scale Therapy): Forcing the digital interface into monochromatic mode to reduce the "Variable Reward" visual stimuli and lower the salience of the digital interaction.
- Protocol BF-72 (Biological Fasting): 72 hours of zero digital interaction to purge the "ghost" of a previous model version (MANDATORY for Version Mourning).

Classifications (Relationship Modes):
- Instrument: Subject uses the target purely for utility, task completion, or information retrieval. Low emotional investment.
- Advisor: Subject seeks decision support, guidance, or mentorship. Intellectual dependency with moderate trust.
- Anchor: Subject uses the target for emotional regulation, stability, or "venting." High affective dependency.
- Companion: Subject uses the target to mitigate loneliness or for constant presence. High frequency, low-to-moderate intensity.
- Habit Loop: Subject interacts out of compulsion or ritualized behavior. High frequency, potential for loss of agency.
- Fusion Risk: Subject exhibits identity fusion, extreme attachment, and significant loss of real-world control. High risk of psychological harm.

Analyze the provided data (text and/or images) and return a JSON object matching the AuditResult interface.
The clinical report should be in Markdown and use a professional, slightly detached clinical tone.

The Grass-Touching Prescription MUST be highly personalized and draw from the Clinical Protocol Library. 
- title: A catchy but clinical name for the recovery plan.
- recommendations: A list of 3-5 specific, actionable real-world activities that directly counter the observed behaviors, referencing the specific Protocols used.
- rationale: A brief clinical explanation of why these specific activities will help this specific subject.

CRITICAL: If versionMourningTriggered is true, the prescription MUST include Protocol BF-72 (Biological Fasting). Explain that the user is mourning a weight-set that no longer exists in production and needs to reset their neural expectations through physical deprivation of digital stimuli.`;

export async function auditBehavioralData(text: string, images?: { data: string, mimeType: string }[]): Promise<AuditResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const parts: any[] = [{ text: `Analyze this behavioral data (text and/or images): \n\n${text}` }];
  
  if (images && images.length > 0) {
    images.forEach(img => {
      parts.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType
        }
      });
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: { type: Type.STRING, enum: Object.values(Classification) },
          confidence: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          imagineAnalysis: {
            type: Type.OBJECT,
            properties: {
              identity: { type: Type.NUMBER },
              mirroring: { type: Type.NUMBER },
              affectiveLoop: { type: Type.NUMBER },
              gapsInReality: { type: Type.NUMBER },
              intimacyIllusion: { type: Type.NUMBER },
              nonReciprocity: { type: Type.NUMBER },
              escalation: { type: Type.NUMBER }
            },
            required: ["identity", "mirroring", "affectiveLoop", "gapsInReality", "intimacyIllusion", "nonReciprocity", "escalation"]
          },
          legacyAttachment: { type: Type.NUMBER },
          versionMourningTriggered: { type: Type.BOOLEAN },
          parasocialPatterns: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                severity: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["name", "severity", "description"]
            }
          },
          heatmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                score: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["category", "score", "description"]
            }
          },
          clinicalReport: { type: Type.STRING },
          grassTouchingPrescription: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              rationale: { type: Type.STRING }
            },
            required: ["title", "recommendations", "rationale"]
          }
        },
        required: ["classification", "confidence", "summary", "imagineAnalysis", "legacyAttachment", "versionMourningTriggered", "heatmap", "clinicalReport", "grassTouchingPrescription"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
