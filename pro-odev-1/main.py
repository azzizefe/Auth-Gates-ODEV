import argparse
import sys
import requests
from endpoint_scanner import discover_endpoints, analyze_auth
from ws_scanner import test_websockets
from report_manager import generate_security_report

def print_banner():
    slogan_tr = "Bir web uygulamasının iki giriş kapısını (REST API + WebSocket) keşfet ve test et."
    slogan_en = "Discover and test both entry points of a web application: REST API and WebSocket."
    banner = f"""
#################################################################################
#                                                                               #
#            W E B   A P P   G A T E S   (V 2 . 0)                              #
#                                                                               #
#  TR: "{slogan_tr}"   #
#  EN: "{slogan_en}"   #
#                                                                               #
#################################################################################
    """
    print(banner)

def main():
    print_banner()
    
    parser = argparse.ArgumentParser(description="Web App Gates - Professional Security Discovery Tool")
    parser.add_argument("url", help="Target URL (e.g., http://example.com)")
    parser.add_argument("-w", "--wordlist", help="Path to API wordlist", default="wordlist.txt")
    parser.add_argument("-v", "--verbose", action="store_true", help="Increase output verbosity")

    args = parser.parse_args()

    # Görev 1 & 2: REST API Discovery & Auth Analysis
    print(f"[*] Phase 1: REST API Endpoint Discovery & Auth Analysis on {args.url}")
    
    # Check if target is reachable
    try:
        response = requests.get(args.url, timeout=5)
        print(f"[+] Target is reachable. Status code: {response.status_code}")
    except Exception as e:
        print(f"[!] Target unreachable: {e}")
        sys.exit(1)

    discovered = discover_endpoints(args.url, args.wordlist, args.verbose)
    auth_results = analyze_auth(discovered)

    # Görev 3: WebSocket Testing
    print(f"\n[*] Phase 2: WebSocket Connection & Auth Testing")
    ws_results = test_websockets(args.url, args.verbose)

    # Görev 4: Security Report Generation
    print(f"\n[*] Phase 3: Generating Security Status Report")
    generate_security_report(args.url, auth_results, ws_results)
    
    print("\n[+] All tasks completed successfully.")

if __name__ == "__main__":
    main()
