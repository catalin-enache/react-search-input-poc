import { useState, memo, useEffect, useCallback } from 'react';
import { highlightText } from 'lib/highlightText';
import './SelectableList.css';

export type Item = { id: string; value: string };

interface SelectableListProps {
  items: Item[];
  onSelect: (item: Item) => void;
  isVisible?: boolean;
  highlight?: string;
}

const SelectableList = ({
  items,
  onSelect,
  isVisible,
  highlight = ''
}: SelectableListProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (!selectedItem) return;
    onSelect(selectedItem);
  }, [onSelect, selectedItem]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault(); // prevents cursor from moving to the beginning/ending of the input
          // const index = !selectedItem ? -1 : items.indexOf(selectedItem);
          // console.log('ArrowDown', index, selectedItem);
          // setSelectedItem(items[(index + 1) % items.length]);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          // const index = !selectedItem
          //   ? items.length
          //   : items.indexOf(selectedItem);
          // setSelectedItem(items[(index - 1 + items.length) % items.length]);
          break;
        }
        case 'Enter': {
          // if (selectedItem) {
          //   onSelect(selectedItem);
          // }
          break;
        }
      }
    },
    [selectedItem, items, onSelect]
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
            console.log('onPointerDown', item);
            setSelectedItem(item);
          }}
          className={`selectableList__item ${selectedItem === item ? 'selectableList__item--selected' : ''}`}
          dangerouslySetInnerHTML={{
            __html: highlightText(item.value, highlight)
          }}
        />
      ))}
    </ul>
  );
};

export default memo(SelectableList);
