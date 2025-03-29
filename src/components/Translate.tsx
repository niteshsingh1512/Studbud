import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Define the function on window explicitly
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en", layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
        "google_translate_element"
      );
    };

    // Load the Google Translate script dynamically
    const addScript = document.createElement("script");
    addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.type = "text/javascript";
    addScript.async = true;
    document.body.appendChild(addScript);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(addScript);
    };
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;
