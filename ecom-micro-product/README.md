GetItemCatalog(search)

This is the endpoint that users call when they're searching for items. The request is routed by API servers to the smart search-results service, which interacts directly with the items table, caches popular item searches, and returns the results.

The API servers also fetch the relevant item stocks from the aggregated_stock table.

UpdateCartItemQuantity(itemId, quantity)

This is the endpoint that users call when they're adding or removing items from their cart. The request writes directly to the carts table, and users can only call this endpoint when an item has enough stock in the aggregated_stock table.

BeginCheckout() & CancelCheckout()

These are the endpoints that users call when they're beginning the checkout process and cancelling it. The BeginCheckout request triggers another read of the aggregated_stock table for the relevant items. If some of the items in the cart don't have enough stock anymore, the UI alerts the users accordingly. For items that do have enough stock, the API servers write to the aggregated_stock table and decrease the relevant stocks accordingly, effectively "reserving" the items during the duration of the checkout. The CancelCheckout request, which also gets automatically called after 10 minutes of being in the checkout process, writes to the aggregated_stock table and increases the relevant stocks accordingly, thereby "unreserving" the items. Note that all of the writes to the aggregated_stock are ACID transactions, which allows us to comfortably rely on this SQL table as far as stock correctness is concerned.

SubmitOrder(), CancelOrder(), & GetMyOrders()

These are the endpoints that users call when they're submitting and cancelling orders. Both the SubmitOrder and CancelOrder requests write to the orders table, and CancelOrder also writes to the aggregated_stock table, increasing the relevant stocks accordingly (SubmitOrder doesn't need to because the checkout process already has). GetMyOrders simply reads from the orders table. Note that an order can only be cancelled if it hasn't yet been shipped, which is knowable from the orderStatus field