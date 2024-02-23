
export function topHalfLogicHandler(data, isMouseInUpperHalf, item, currentItem, draggedItem) {
    if (!isMouseInUpperHalf) return data

    const currentItemTemp = data.find((obj) => obj.id === currentItem.id);
    const draggedItemTemp = data.find((obj) => obj.id === item.id);

    if (currentItemTemp.parent === item.parent) {
        // console.log('%cLogic for top half when parent is the same', 'color: green');
        data = data.map((el) => {
            if (currentItemTemp.order < draggedItemTemp.order) {
                if (el.id === currentItemTemp.id) {
                    return { ...el, order: draggedItemTemp.order - 1 };
                } else if (
                    el.parent === currentItemTemp.parent &&
                    el.order <= draggedItemTemp.order - 1 &&
                    el.order > currentItemTemp.order
                ) {
                    return { ...el, order: el.order - 1 };
                }
            } else {
                if (el.id === currentItemTemp.id) {
                    return { ...el, order: draggedItemTemp.order };
                } else if (
                    el.parent === currentItemTemp.parent &&
                    el.order >= draggedItemTemp.order &&
                    el.order < currentItemTemp.order
                ) {
                    return { ...el, order: el.order + 1 };
                }
            }
            return el
        })
    } else {
        if (item.id !== (draggedItem?.id || null)) {
            // console.log('%cLogic for top half when parent is different', 'color: yellow');
            data = data.map((el) => {
                if (el.id === currentItemTemp.id) {
                    return { ...el, order: draggedItemTemp?.order, parent: draggedItemTemp.parent };
                }
                else if (
                    el.parent === currentItemTemp.parent &&
                    el.order >= currentItemTemp.order
                ) {
                    return { ...el, order: el.order - 1 };
                }
                else if (
                    el.parent === draggedItemTemp.parent &&
                    el.order >= draggedItemTemp.order
                ) {
                    return { ...el, order: el.order + 1 };
                }
                return el;
            });
        }
    }

    return [...data]
}

export function bottomHalfLogicHandler(data, isMouseInUpperHalf, item, currentItem, draggedItem) {
    if (isMouseInUpperHalf) return data

    const currentItemTemp = data.find((obj) => obj.id === currentItem.id);
    const draggedItemTemp = data.find((obj) => obj.id === item.id);

    if (currentItemTemp.parent === item.parent) {
        // console.log('%cLogic for bottom half when parent is the same', 'color: blue');
        data = data.map((el) => {
            if (currentItemTemp.order < draggedItemTemp.order) {
                if (el.id === currentItemTemp.id) {
                    return { ...el, order: draggedItemTemp.order };
                }
                if (
                    el.parent === currentItemTemp.parent &&
                    el.order <= draggedItemTemp.order &&
                    el.order > currentItemTemp.order
                ) {
                    return { ...el, order: el.order - 1 };
                }
            } else {
                if (el.id === currentItemTemp.id) {
                    return { ...el, order: draggedItemTemp.order + 1 };
                }
                if (
                    el.parent === currentItemTemp.parent &&
                    el.order > draggedItemTemp.order &&
                    el.order <= currentItemTemp.order
                ) {
                    return { ...el, order: el.order + 1 }
                }
            }
            return el;
        })
    } else {
        if (item.id !== (draggedItem?.id || null)) {
            // console.log('%cLogic for bottom half when parent is different', 'color: yellow');
            data = data.map((el) => {
                if (el.id === currentItemTemp.id) {
                    return { ...el, order: draggedItemTemp?.order + 1, parent: draggedItemTemp.parent };
                }
                else if (
                    el.parent === currentItemTemp.parent &&
                    el.order >= currentItemTemp.order
                ) {
                    return { ...el, order: el.order - 1 };
                }
                else if (
                    el.parent === draggedItemTemp.parent &&
                    el.order > draggedItemTemp.order
                ) {
                    return { ...el, order: el.order + 1 };
                }
                return el;
            });
        }
    }

    return data
}

export function isDescendant(parent, child, items) {
    if (parent === child) {
        return true;
    }

    const parentItem = items.find((item) => item.id === parent);
    if (!parentItem || parentItem.parent === null) {
        return false;
    }

    return isDescendant(parentItem.parent, child, items);
};