'use client';

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { JobCategory } from "@prisma/client";
import { useTransition } from "react";

function SortableCategoryItem({ id, name }: { id: string; name: string }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="border border-black p-2 cursor-move bg-white text-black font-bold mb-2"
      >
        {name}
      </div>
    );
  }
  
  export default function SortableCategories({ categories }: { categories: JobCategory[] }) {
    const [items, setItems] = useState<JobCategory[]>([...categories].sort((a, b) => a.order - b.order));
    const [isPending, startTransition] = useTransition();
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
  
      if (!over || active.id === over.id) return;
  
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
  
      // Recalculate order (starting from 1)
      const reordered = newItems.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
  
      setItems(reordered);
  
      // Persist to server
      startTransition(() => {
        // updateCategoryOrder(reordered[0].organizationId, reordered.map(({ id, order }) => ({ id, order })));
      });
    };
  
    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <p className='text-black'>{JSON.stringify(items)}</p>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((category) => (
            <SortableCategoryItem key={category.id} id={category.id} name={category.name} />
          ))}
        </SortableContext>
      </DndContext>
    );
  }