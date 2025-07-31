// components/ThemeToggle.tsx
import React from 'react';
import { Button } from 'primereact/button';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  const icon = isDarkMode ? 'pi pi-sun' : 'pi pi-moon';
  const mode = isDarkMode ? 'dark-mode' : 'light-mode';
  const tooltip = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <Button
      icon={icon}
      onClick={onToggle}
      className={`theme-toggle ${mode}`}
      tooltip={tooltip}
      tooltipOptions={{ position: 'bottom' }}
      text
      rounded
      size="large"
    />
  );
};

export default ThemeToggle;
