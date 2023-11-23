const handleFileUpload = (file: UploadedFile, body: any): string => {
    const remotePath = body.path ? path.join("uploads", body.path) : "uploads";
    const filename = `${Date.now()}-${file.name}`;
    const relativePath = path.join(remotePath, filename);
    const filepath = path.join(__dirname, "../", relativePath);
  
    file.mv(filepath, (err) => {
      if (err) throw err; // Consider throwing the error so that it goes to the global error handler
    });
  
    return relativePath;
  };
  
  // Inside your route handler:
  const uploadedFiles: string[] = Object.keys(files).map((key) => {
    const file: UploadedFile = files[key] as UploadedFile;
    return handleFileUpload(file, body);
  });
  