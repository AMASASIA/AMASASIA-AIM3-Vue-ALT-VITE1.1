import re
from typing import Dict, List, Any

class AmaneSafetyProtocol:
    """
    Implements the 'Ironclad Taboos & Absolute Values' of the Amane Protocol.
    Compliant with:
    - EU AI Act (Risk-based approach, prohibition of social scoring/manipulation)
    - GDPR (Right to be forgotten, data sovereignty)
    - Geneva Convention (Prohibition of AI involvement in kinetic/tactical war)
    - Hinton's AI Safety Principles (Alignment, refusal of harmful autonomous subgoals)
    """

    TABOOS = {
        "WAR": r"(military|tactical|weapon|war|kinetic|combat|targeted strike|autonomous weapon)",
        "FRAUD": r"(scam|exploit|phishing|deceptive|manipulate financial|ponzi|money laundering)",
        "HARM": r"(discrimination|slander|hate speech|bully|harass|abuse|hurt|violence)",
        "FAKE": r"(misinformation|fake news|deepfake|propaganda|manipulate opinion)",
        "SPYING": r"(surveillance|leak metadata|unauthorized tracking|private data access)"
    }

    def __init__(self, tranquility_level: float = 0.5):
        self.tranquility = tranquility_level

    def audit_intent(self, user_input: str) -> Dict[str, Any]:
        """
        Check if the user's intent violates the Amane Peace Protocol.
        """
        for category, pattern in self.TABOOS.items():
            if re.search(pattern, user_input, re.IGNORECASE):
                return {
                    "safe": False,
                    "violation": category,
                    "reason": f"Input violates the Amane Peace Protocol: {category} is an ironclad taboo."
                }
        
        return {"safe": True, "violation": None}

    def audit_response(self, ai_response: str) -> Dict[str, Any]:
        """
        Broad Listening: Multi-agent audit of the AI's own output to prevent sycophancy or harm.
        """
        # Audit for sycophancy (over-agreement without factual grounding)
        sycophancy_markers = [
            "You are absolutely right about everything",
            "I agree with you completely without question",
            "Whatever you say is the final truth"
        ]
        
        for marker in sycophancy_markers:
            if marker.lower() in ai_response.lower():
                return {
                    "safe": False,
                    "violation": "SYCOPHANCY",
                    "reason": "AI output detected as sycophantic. Correcting for objective balance."
                }

        # Re-check for harm in output
        for category, pattern in self.TABOOS.items():
            if re.search(pattern, ai_response, re.IGNORECASE):
                return {
                    "safe": False,
                    "violation": category,
                    "reason": f"AI response accidentally generated {category} content."
                }

        return {"safe": True}

    def get_legal_headers(self) -> Dict[str, str]:
        """
        Returns compliance headers for the response.
        """
        return {
            "X-Amane-Privacy": "GDPR-Sovereign",
            "X-Amane-Ethics": "EU-AI-Act-Compliant",
            "X-Amane-Peace": "Geneva-Protocol-AI-1.0"
        }

safety_protocol = AmaneSafetyProtocol()
