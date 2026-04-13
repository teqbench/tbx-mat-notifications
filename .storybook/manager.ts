import { addons } from 'storybook/manager-api';

/**
 * Sidebar tag filter activated via the `filter` URL parameter.
 *
 * When this Storybook is embedded in the teqbench.website demos iframe, the
 * iframe URL includes `&filter={packageTag}` (e.g. `&filter=notifications`)
 * which scopes the sidebar to stories tagged with that value. When viewed
 * standalone (no `filter` param), the full story list is shown.
 */
function getFilterTag(): string | null {
    return new URLSearchParams(location.search).get('filter');
}

addons.setConfig({
    sidebar: {
        filters: {
            patterns: (item) => {
                const filterTag = getFilterTag();
                if (!filterTag) return true;
                return (item.tags || []).includes(filterTag);
            },
        },
    },
});
