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
import { updateCategoryOrder } from "@/actions/category/sort-categories";
import { Button } from "@/components/ui/button";
import { JobCategory } from "@prisma/client";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";

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
      className="border border-black p-4 cursor-move bg-white text-black font-bold mb-2 flex justify-between items-center"
    >
      <p className="select-none">{name}</p>
      <Button className="rounded-none bg-black hover:bg-black">
        <Trash className="w-4 h-4 text-white" />
      </Button>
    </div>

  );
}

export default function SortableCategories({ categories }: { categories: JobCategory[] }) {
  const [items, setItems] = useState<JobCategory[]>(
    [...categories].sort((a, b) => a.order - b.order)
  );
  const [saving, setSaving] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    // Update local order (just UI)
    const reordered = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setItems(reordered);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateCategoryOrder(items[0].organizationId, items.map(({ id, order }) => ({ id, order })));
      toast(res?.message)
    } catch (e) {
      console.error("Failed to save order", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((category) => (
            <SortableCategoryItem key={category.id} id={category.id} name={category.name} />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 bg-black text-white hover:bg-black rounded-none"
      >
        {
          saving
          ?
          <>
          <Loader2 className="animate-spin text-white" />
          </>
          :
          <>
          </>
        }
        save changes
      </Button>
    </>
  );
}