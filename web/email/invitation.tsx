import {
	Body,
	Button,
	Container,
	Column,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Text,
	Tailwind,
} from "@react-email/components"
import { OrganizationInvite } from "@prisma/client"
import { Prisma } from "@prisma/client"

type OrganizationInviteWithOrganization = Prisma.OrganizationInviteGetPayload<{
    include: {
        organization: true
    }
}>

export function InviteUserEmail({OrganizationInvite, inviter, email } : {OrganizationInvite: OrganizationInviteWithOrganization, inviter: string, email: string}) {
    const previewText = `Join ${OrganizationInvite.organization.name}`
    return (
        <>
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans px-2">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							Join <strong>{inviter}</strong> on <strong>{OrganizationInvite.organization.name}</strong>
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hello there,
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							<strong>{inviter}</strong> has invited you to the <strong>{OrganizationInvite.organization.name}</strong> team on{" "}
							<strong>wegotwork.co</strong>.
						</Text>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
								href={`https://heliup.xyz/invitation/${OrganizationInvite.id}`}
							>
								Join the team
							</Button>
						</Section>
						<Text className="text-black text-[14px] leading-[24px]">
							or copy and paste this URL into your browser:{" "}
							<Link href={`https://heliup.xyz/invitation/${OrganizationInvite.id}`} className="text-blue-600 no-underline">
								{`https://heliup.xyz/invitation/${OrganizationInvite.id}`}
							</Link>
						</Text>
						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							This invitation was intended for{" "}
							<span className="text-black">{OrganizationInvite.email}</span>. If you were not
							expecting this invitation, you can ignore this email.
						</Text>
					</Container>
				</Body>
            </Tailwind>
        </Html>
        </>
    )
}