import { useEffect } from 'react';

export default function useDocumentMeta({ title, description, robots }) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    let descMeta = document.querySelector('meta[name="description"]');
    const prevDesc = descMeta ? descMeta.content : null;
    if (description) {
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.name = 'description';
        document.head.appendChild(descMeta);
      }
      descMeta.content = description;
    }

    let robotsMeta = document.querySelector('meta[name="robots"]');
    const prevRobots = robotsMeta ? robotsMeta.content : null;
    if (robots) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = robots;
    }

    return () => {
      document.title = prevTitle;
      if (description) {
        if (prevDesc !== null && descMeta) descMeta.content = prevDesc;
        else if (descMeta) descMeta.remove();
      }
      if (robots) {
        if (prevRobots !== null && robotsMeta) robotsMeta.content = prevRobots;
        else if (robotsMeta) robotsMeta.remove();
      }
    };
  }, [title, description, robots]);
}
