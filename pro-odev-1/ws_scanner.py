import asyncio
import websockets
import requests

async def check_websocket(url):
    """
    Helper to check a single WS connection.
    """
    try:
        ws_url = url.replace("http://", "ws://").replace("https://", "wss://")
        async with websockets.connect(ws_url, timeout=5) as ws:
            return True, "Connection Successful (No initial auth required)"
    except Exception as e:
        return False, str(e)

def test_websockets(base_url, verbose=False):
    """
    Görev 3: WebSocket bağlantı testi ve auth kontrolü
    """
    print("\n[*] Testing WebSocket Endpoints:")
    common_ws_paths = ["/ws", "/socket.io", "/chat", "/messenger"]
    ws_results = []
    
    for path in common_ws_paths:
        url = f"{base_url.rstrip('/')}/{path.lstrip('/')}"
        if verbose:
            print(f"[*] Testing WS upgrade on: {url}")
            
        try:
            resp = requests.head(url, timeout=3)
            if resp.status_code == 404:
                continue
        except:
            pass

        try:
            # Use a fresh event loop if needed or just run
            success, msg = asyncio.run(check_websocket(url))
            if success:
                print(f"[!] Found Open WebSocket: {url} -> {msg}")
                ws_results.append(url)
            elif "401" in msg or "403" in msg:
                print(f"[+] Protected WebSocket: {url} (Requires Auth)")
        except Exception as e:
            if verbose:
                print(f"[!] WS Error on {url}: {e}")
            
    return ws_results

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Standalone WebSocket Security Tester")
    parser.add_argument("url", help="Target URL")
    args = parser.parse_args()
    test_websockets(args.url, verbose=True)
