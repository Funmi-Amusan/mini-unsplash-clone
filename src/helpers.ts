export const getRowSpan = (index: number) => {
    const rowSpans = [
        { span: 'row-span-3', },
        { span: 'row-span-4', },
        { span: 'row-span-3', },
        { span: 'row-span-4', },
        { span: 'row-span-4', },
        { span: 'row-span-3', },
        { span: 'row-span-4', }
    ];
    return rowSpans[index % rowSpans.length];
};