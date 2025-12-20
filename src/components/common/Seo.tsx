import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title: string;
    description?: string;
    type?: string;
    name?: string;
    image?: string;
}

export const Seo = ({
    title,
    description = 'Plataforma de comunidade para desenvolvedores compartilharem conhecimento, resolverem problemas e crescerem juntos.',
    type = 'website',
    name = 'Alldev',
    image = 'https://alldev.pt/og-image.png',
}: SeoProps) => {
    const fullTitle = title.includes('Alldev') ? title : `${title} - Alldev`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:creator" content={name} />
        </Helmet>
    );
};
