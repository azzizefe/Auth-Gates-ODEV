def generate_security_report(target, api_results, ws_results):
    """
    Görev 4: Güvenlik durumu raporu oluştur
    """
    report_name = "security_report.md"
    print(f"\n[*] Generating security report: {report_name}")
    
    with open(report_name, "w") as f:
        f.write(f"# Security Status Report for {target}\n\n")
        f.write("## 1. REST API Security\n")
        f.write(f"- **Total Endpoints Found**: {len(api_results['public']) + len(api_results['protected']) + len(api_results['forbidden'])}\n")
        f.write(f"- **Public Endpoints**: {len(api_results['public'])}\n")
        f.write(f"- **Protected Endpoints**: {len(api_results['protected'])}\n\n")
        
        if api_results["public"]:
            f.write("### Critical: Public Endpoints Found\n")
            for url in api_results["public"]:
                f.write(f"- [ ] `{url}`\n")
        
        f.write("\n## 2. WebSocket Security\n")
        f.write(f"- **Open WebSockets**: {len(ws_results)}\n")
        for url in ws_results:
            f.write(f"- [!] Open: `{url}`\n")
            
        f.write("\n## 3. Güvenlik Referansları\n")
        f.write("- **RFC 6455**: WebSocket Protokolü Standartları.\n")
        f.write("- **RFC 9110**: HTTP Semantiği ve Durum Kodları.\n")
        f.write("- **OWASP API Security Top 10**: API güvenlik riskleri ve en iyi uygulamalar.\n")
            
    print(f"[+] Report generated successfully: {report_name}")
