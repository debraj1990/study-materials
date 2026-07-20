// Import filesystem module
const fs = require("fs");
//TODO: Change "powershell.exe" to "/bin/sh" in linux env
let spawnedShell = require("child_process").spawn("powershell.exe");
const runner = {
  spawnedShell: async (element, socket) => {
    // Console required to know runner has started
    console.log("Executing Commands...");

    // Capture stdout
    spawnedShell.stdout.on("data", (d) => {
      // sends the data to everyone connected to the server
      socket.emit("shell_stdout", d.toString());
    });
    // Capture stdout
    spawnedShell.stderr.on("data", (d) => {
      // sends the data to everyone connected to the server
      socket.emit("shell_stderr", d.toString());
    });
    // to logout
    spawnedShell.on("exit", (code) => {
      socket.emit("shell_stdout", `exited with code ${code.toString()}`);
      spawnedShell = require("child_process").spawn("powershell.exe");
    });
    // Write some input to it
    spawnedShell.stdin.write(element + "\n");
    //spawnedShell session end at logout
    // if (element === "exit") {
    //   // End spawnedShell session
    //   // spawnedShell.stdin.end();
    //   // List all the filenames before renaming
    //   runner.getCurrentFilenames();

    //   // Rename the file
    //   fs.rename(
    //     "./pages/shellScripts/spawnedShell.js",
    //     "./pages/shellScripts/spawnedShell_rename.js",
    //     (error) => {
    //       if (error) {
    //         // Show the error
    //         console.log(error);
    //       } else {
    //         // List all the filenames after renaming
    //         console.log("\nFile Renamed\n");

    //         // List all the filenames after renaming
    //         runner.getCurrentFilenames();
    //       }
    //     }
    //   );
    //   setTimeout(() => {
    //     // Rename the file
    //     fs.rename(
    //       "./pages/shellScripts/spawnedShell_rename.js",
    //       "./pages/shellScripts/spawnedShell.js",
    //       (error) => {
    //         if (error) {
    //           // Show the error
    //           console.log(error);
    //         } else {
    //           // List all the filenames after renaming
    //           console.log("\nFile Renamed\n");

    //           // List all the filenames after renaming
    //           runner.getCurrentFilenames();
    //         }
    //       }
    //     );
    //   }, 500);
    // }
  },
  execShell: async (element, socket) => {
    const { execSync } = require("child_process");
    // Console required to know runner has started
    console.log("Executing execShell Commands...");

    // Execute command and Capture stdout
    const capturedOutput = execSync(element);
    console.log("logging capturedOutput", capturedOutput);
    // sends the data to everyone connected to the server
    socket.emit("shell_stdout", capturedOutput.toString());
  },
  getCurrentFilenames: () => {
    console.log("Current filenames:");
    fs.readdirSync("./pages/shellScripts").forEach((file) => {
      //__dirname
      console.log(file);
    });
  },
};
export default runner;
