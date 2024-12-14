import psutil

def kill_chromedriver_and_related_chrome():
    for proc in psutil.process_iter(attrs=["name", "pid", "children"]):
        try:
            #find `chromedriver` processes
            if proc.info["name"] == "chromedriver":
                print(f"Killing chromedriver (PID: {proc.pid}) and its child processes...")
                
                #kill all child processes (e.g., Chrome instances spawned by chromedriver)
                for child in proc.children(recursive=True):
                    print(f"Killing child process: {child.name()} (PID: {child.pid})")
                    child.terminate()

                #kill the chromedriver process itself
                proc.terminate()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

if __name__ == "__main__":
    kill_chromedriver_and_related_chrome()
