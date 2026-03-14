import requests

def discover_endpoints(base_url, wordlist_path, verbose=False):
    """
    Görev 1: REST API endpoint keşif tarayıcısı
    """
    print(f"[*] Starting discovery with wordlist: {wordlist_path}")
    discovered = []
    
    try:
        with open(wordlist_path, 'r') as f:
            paths = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"[!] Wordlist not found: {wordlist_path}")
        return []

    for path in paths:
        url = f"{base_url.rstrip('/')}/{path.lstrip('/')}"
        if verbose:
            print(f"[*] Testing: {url}")
        
        try:
            # We use HEAD first to save bandwidth
            response = requests.head(url, timeout=3, allow_redirects=True)
            if response.status_code != 404:
                print(f"[+] Found: {url} (Status: {response.status_code})")
                discovered.append({"url": url, "status": response.status_code})
        except requests.RequestException:
            continue
            
    return discovered

def analyze_auth(discovered_endpoints):
    """
    Görev 2: Her endpoint'in auth gereksinimini tespit et (401 vs 200)
    """
    print("\n[*] Analyzing Authentication Requirements:")
    results = {
        "public": [],
        "protected": [],
        "forbidden": [],
        "other": []
    }

    for item in discovered_endpoints:
        url = item["url"]
        status = item["status"]
        
        if status == 200:
            print(f"[!] WARNING: Potential Public Endpoint: {url}")
            results["public"].append(url)
        elif status == 401:
            print(f"[+] Protected Endpoint (Requires Auth): {url}")
            results["protected"].append(url)
        elif status == 403:
            print(f"[-] Forbidden Endpoint: {url}")
            results["forbidden"].append(url)
        else:
            results["other"].append(url)
            
    return results

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Standalone Endpoint Discovery Tool")
    parser.add_argument("url", help="Target URL")
    parser.add_argument("-w", "--wordlist", default="wordlist.txt", help="Wordlist path")
    args = parser.parse_args()
    
    found = discover_endpoints(args.url, args.wordlist, verbose=True)
    analyze_auth(found)
