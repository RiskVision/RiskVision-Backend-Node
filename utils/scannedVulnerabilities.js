const paxVuln = {
  "response": {
      "cve-2023-42133": {
          "affected_products": [],
          "basic": {
              "date_created": "2024-10-11T13:15:00",
              "date_modified": "2024-10-15T12:58:00",
              "description": "PAX Android based POS devices allow for escalation of privilege via improperly configured scripts.\n\nAn attacker must have shell access with system account privileges in order to exploit this vulnerability.\nA patch addressing this issue was included in firmware version PayDroid_8.1.0_Sagittarius_V11.1.61_20240226.",
              "key": "cve-2023-42133",
              "mitre_url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-42133",
              "nvd_url": "https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2023-42133",
              "type": "N/A",
              "year": "2023"
          },
          "details": {
              "access_complexity": "N/A",
              "access_vector": "N/A",
              "authentication": "N/A",
              "confidence": "n/a",
              "cvssV3_score": 0,
              "cvss_score": 0,
              "mitre_attack_id": [],
              "privileges_required": "N/A",
              "seen_in_wild": false,
              "severity": "N/A",
              "user_interaction": "N/A"
          }
      }
  }
}

const paxVuln2 = {
  "response": {
      "cve-2023-42137": {
          "affected_products": [],
          "basic": {
              "date_created": "2024-01-15T14:15:00",
              "date_modified": "2024-10-10T16:15:00",
              "description": "PAX Android based POS devices with PayDroid_8.1.0_Sagittarius_V11.1.50_20230614 or earlier can allow for command execution with high privileges by using malicious symlinks.\n\n\n\n\nThe attacker must have shell access to the device in order to exploit this vulnerability.",
              "key": "cve-2023-42137",
              "mitre_url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-42137",
              "nvd_url": "https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2023-42137",
              "type": "N/A",
              "year": "2023"
          },
          "details": {
              "access_complexity": "N/A",
              "access_vector": "N/A",
              "authentication": "N/A",
              "confidence": "high",
              "cvssV3_score": 7.8,
              "cvss_score": 0,
              "mitre_attack_id": [],
              "privileges_required": "LOW",
              "seen_in_wild": false,
              "severity": "HIGH",
              "user_interaction": "NONE"
          }
      }
  }
}

const paxVuln3 = {
  "response": {
      "cve-2023-42136": {
          "affected_products": [],
          "basic": {
              "date_created": "2024-01-15T14:15:00",
              "date_modified": "2024-10-10T16:15:00",
              "description": "PAX Android based POS devices with PayDroid_8.1.0_Sagittarius_V11.1.50_20230614 or earlier can allow the execution of arbitrary commands with system account privilege by shell injection starting with a specific word.\n\n\n\n\nThe attacker must have shell access to the device in order to exploit this vulnerability.",
              "key": "cve-2023-42136",
              "mitre_url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-42136",
              "nvd_url": "https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2023-42136",
              "type": "N/A",
              "year": "2023"
          },
          "details": {
              "access_complexity": "N/A",
              "access_vector": "N/A",
              "authentication": "N/A",
              "confidence": "high",
              "cvssV3_score": 7.8,
              "cvss_score": 0,
              "mitre_attack_id": [],
              "privileges_required": "LOW",
              "seen_in_wild": false,
              "severity": "HIGH",
              "user_interaction": "NONE"
          }
        }
  }
}

const paxVulnerabilities = [paxVuln, paxVuln2, paxVuln3]

/* function cleanVulns(vulnerabilities) {
  return vulnerabilities.map(vuln => {
    const cleanedVuln = {};
    if (vuln.response) {
      for (const key in vuln.response) {
        cleanedVuln[key] = {
          basic: JSON.stringify(vuln.response[key].basic, null, 2),
          details: JSON.stringify(vuln.response[key].details, null, 2)
        };
      }
    }
    return cleanedVuln;
  });
}

// Ejemplo de uso
const cleanedVulnerabilities = cleanVulns(paxVulnerabilities);
*/
//console.log(paxVulnerabilities); 



module.exports = {paxVulnerabilities};
