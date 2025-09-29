# 🔒 How to Report Security Vulnerabilities

## 📧 **Email Method (Recommended):**
Send email to: **security@quizzicallabz.qzz.io**

## 📝 **What to Include:**

### **Subject Line:**
`[SECURITY] Vulnerability Report - [Brief Description]`

### **Email Content:**
```
1. VULNERABILITY TYPE:
   - XSS, SQL Injection, Authentication bypass, etc.

2. AFFECTED URL/COMPONENT:
   - https://quizzicallabz.qzz.io/specific-page
   - Or specific feature/component

3. STEPS TO REPRODUCE:
   Step 1: Go to...
   Step 2: Click on...
   Step 3: Enter...
   Step 4: Observe...

4. IMPACT:
   - What can an attacker do?
   - How serious is this?

5. PROOF OF CONCEPT:
   - Screenshots
   - Code snippets
   - Video (if needed)

6. YOUR CONTACT INFO:
   - Name (optional)
   - Email for follow-up
```

## ⏰ **Response Time:**
- **Acknowledgment:** Within 48 hours
- **Updates:** Every 7 days
- **Resolution:** Depends on severity

## 🎯 **Example Report:**
```
Subject: [SECURITY] XSS Vulnerability in Quiz Creation

Hi Security Team,

I found a potential XSS vulnerability in the quiz creation form.

VULNERABILITY: Stored XSS
URL: https://quizzicallabz.qzz.io/generate-quiz
IMPACT: High - Can steal user sessions

STEPS:
1. Go to quiz creation page
2. Enter <script>alert('XSS')</script> in topic field
3. Create quiz
4. Script executes when quiz is viewed

CONTACT: researcher@example.com

Thanks,
Security Researcher
```

## 🚫 **Don't:**
- Post publicly before we respond
- Test on production without permission
- Access other users' data

## ✅ **We Will:**
- Respond quickly
- Keep you updated
- Credit you (if desired)
- Fix the issue promptly