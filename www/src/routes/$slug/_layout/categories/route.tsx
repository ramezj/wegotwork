import { Layout } from "@/components/shared/layout";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getOrganizationCategoriesQuery } from "@/features/queries/category";

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
  const { data } = useSuspenseQuery(getOrganizationCategoriesQuery(slug));
  return (
    <>
      <Layout
        title="Categories"
        primaryButton={
          <Button asChild>
            <Link target="_blank" to="/">
              Create Category
            </Link>
          </Button>
        }
      >
        {data.categories.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </Layout>
    </>
  );
}
