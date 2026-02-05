import './returnpolicy.css';

export default function ReturnPolicy(){
  return (
    <div className="policy-page">
      <h1>Return Policy</h1>

      <div className="policy-content">
        <section className="policy-section">
          <h2>7-Day Return Policy</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're not happy with your order, 
            you can return it within 7 days of delivery for a full refund, exchange, or store credit.
          </p>
        </section>

        <section className="policy-section">
          <h2>Eligibility for Returns</h2>
          <div className="checklist">
            <div className="check-item">✓ Product must be in original, unused condition</div>
            <div className="check-item">✓ All original packaging, tags, and accessories included</div>
            <div className="check-item">✓ Return initiated within 7 days of delivery</div>
            <div className="check-item">✓ Valid proof of purchase (order ID)</div>
            <div className="check-item">✓ No signs of wear, damage, or misuse</div>
          </div>
        </section>

        <section className="policy-section">
          <h2>Non-Returnable Items</h2>
          <div className="checklist error">
            <div className="check-item">✗ Underwear and intimate apparel</div>
            <div className="check-item">✗ Perishable items (food, cosmetics)</div>
            <div className="check-item">✗ Items damaged due to misuse or neglect</div>
            <div className="check-item">✗ Custom or personalized products</div>
            <div className="check-item">✗ Items without original packaging</div>
          </div>
        </section>

        <section className="policy-section">
          <h2>How to Return an Item</h2>
          <div className="steps">
            <div className="step">
              <span className="step-num">1</span>
              <div>
                <h4>Initiate Return</h4>
                <p>Log into your account and select "Return" from your order details.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <div>
                <h4>Select Reason</h4>
                <p>Choose the reason for your return (damaged, defective, not as described, changed mind, etc.)</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <div>
                <h4>Print Label</h4>
                <p>Download and print the pre-paid return shipping label provided.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">4</span>
              <div>
                <h4>Ship Back</h4>
                <p>Pack securely and drop at any pickup point. We'll arrange free pickup if needed.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">5</span>
              <div>
                <h4>Get Refunded</h4>
                <p>Once received and inspected, refund processed in 3-5 business days.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="policy-section">
          <h2>Damaged or Defective Items</h2>
          <p>
            If your item arrives damaged or defective, please report it within 24 hours of delivery. 
            We'll process a replacement or full refund immediately. <a href="/contact">Contact us</a> with photos 
            for faster resolution.
          </p>
        </section>

        <section className="policy-section">
          <h2>Refund Timeline</h2>
          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-dot">📦</span>
              <div>
                <h4>1. Return Shipped</h4>
                <p>Item shipped back to our warehouse</p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-dot">📋</span>
              <div>
                <h4>2. Quality Check</h4>
                <p>Item inspected (1-2 business days)</p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-dot">✅</span>
              <div>
                <h4>3. Approval</h4>
                <p>Return approved and refund initiated</p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-dot">💰</span>
              <div>
                <h4>4. Refund Credited</h4>
                <p>Refund in your account (3-5 days)</p>
              </div>
            </div>
          </div>
        </section>

        <section className="policy-section">
          <h2>Shipping Costs</h2>
          <ul className="policy-list">
            <li>Free return shipping for defective or damaged items</li>
            <li>For change of mind returns, you pay return shipping</li>
            <li>Refund excludes original shipping cost</li>
            <li>Express shipping not refundable</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Exceptions & Special Cases</h2>
          <ul className="policy-list">
            <li><strong>Sale Items:</strong> Final sale items may have limited return eligibility</li>
            <li><strong>Seasonal Items:</strong> Subject to availability and return window extension</li>
            <li><strong>Large Items:</strong> Furniture and large appliances may have different terms</li>
            <li><strong>International Orders:</strong> Subject to customs and import regulations</li>
          </ul>
        </section>

        <section className="policy-section contact-cta">
          <h2>Need Help?</h2>
          <p>Still have questions? <a href="/contact">Contact our support team</a> or call us at <a href="tel:+919876543210">+91 98765 43210</a></p>
        </section>
      </div>
    </div>
  );
}
