import { useState, memo, useEffect, useCallback, ReactNode } from 'react';
import './SelectableList.css';

export type Item = { id: string; value: string };

interface SelectableListProps {
  items: Item[];
  onSelect: (item: Item) => void;
  isVisible?: boolean;
  formatter?: (item: string) => ReactNode;
}

const SelectableList = ({
  items,
  onSelect,
  isVisible,
  formatter = (item) => item
}: SelectableListProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // prevent sending out selectedItem by arrow nav when hidden
      if (!isVisible) return;
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault(); // prevents cursor from moving to the beginning/ending of the input
          const index = !selectedItem ? -1 : items.indexOf(selectedItem);
          const newSelectedItem = items[(index + 1) % items.length];
          setSelectedItem(newSelectedItem);
          onSelect(newSelectedItem);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const index = !selectedItem
            ? items.length
            : items.indexOf(selectedItem);
          const newSelectedItem =
            items[(index - 1 + items.length) % items.length];
          setSelectedItem(newSelectedItem);
          onSelect(newSelectedItem);
          break;
        }
      }
    },
    [onSelect, selectedItem, items, isVisible]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ul
      className={`selectableList ${isVisible ? 'selectableList--visible' : ''}`}
    >
      {items.map((item) => (
        <li
          key={item.id}
          onPointerDown={() => {
            setSelectedItem(item);
            onSelect(item);
          }}
          className={`selectableList__item ${selectedItem === item ? 'selectableList__item--selected' : ''}`}
        >
          {formatter(item.value)}
        </li>
      ))}
    </ul>
  );
};

export default memo(SelectableList);
