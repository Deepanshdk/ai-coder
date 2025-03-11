import { WebContainer } from '@webcontainer/api';
import React, { useCallback, useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const main =useCallback(async()=>{
    if (!webContainer) {
      setError("WebContainer not initialized");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Install dependencies
      const installProcess = await webContainer.spawn('npm', ['install']);
      const installExitCode = await installProcess.exit;
      
      if (installExitCode !== 0) {
        throw new Error('Dependencies installation failed');
      }

      // Start the development server
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      
      // Listen for server-ready event
      webContainer.on('server-ready', (port, serverUrl) => {
        console.log('Server is ready on port:', port);
        console.log('Preview URL:', serverUrl);
        setUrl(serverUrl);
        setIsLoading(false);
      });

      // Handle server output
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('Server output:', data);
          if (data.includes('error')) {
            setError('Server encountered an error');
            setIsLoading(false);
          }
        }
      }));
    } catch (error) {
      console.error('Error in WebContainer setup:', error);
      setError(error instanceof Error ? error.message : 'Failed to start preview server');
      setIsLoading(false);
    }
  },[webContainer]) 

  useEffect(() => {
    main();
  }, [webContainer,main]); // Re-run when webContainer changes

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {isLoading && (
        <div className="text-center">
          <p className="mb-2">Starting preview server...</p>
        </div>
      )}
      {error && (
        <div className="text-center text-red-400">
          <p className="mb-2">{error}</p>
        </div>
      )}
      {url && !error && !isLoading && (
        <iframe 
          width={"100%"} 
          height={"100%"} 
          src={url}
          title="Preview"
          className="border-0"
        />
      )}
    </div>
  );
}


export default React.memo(PreviewFrame);