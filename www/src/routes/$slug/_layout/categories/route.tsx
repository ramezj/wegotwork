import { Layout } from "@/components/shared/layout";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateCategoryDialog } from "@/components/category/create-category-dialog";
import { Card } from "@/components/ui/card";
import { categoriesByOrgSlugQueryOptions } from "@/features/queries/categories";

export const Route = createFileRoute("/$slug/_layout/categories")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "Categories", content: "Categories" },
      { name: "Categories" },
    ],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(categoriesByOrgSlugQueryOptions(slug));
  const categories = data?.categories || [];
  
  return (
    <>
      <Layout
        variant="header"
        title={`Categories (${categories.length})`}
        primaryButton={<CreateCategoryDialog slug={slug} />}
      >
        <div className="flex flex-col gap-2">
          {categories.map((category: any) => (
            <Card
              key={category.id}
              className="p-4 border rounded-lg font-semibold"
            >
              {category.name}
            </Card>
          ))}
        </div>
      </Layout>
    </>
  );
}
