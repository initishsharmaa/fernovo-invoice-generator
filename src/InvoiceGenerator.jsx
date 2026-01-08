import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Box, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  InputAdornment
} from '@mui/material';
import { 
  Download, 
  CalendarToday, 
  Person, 
  Phone, 
  Email, 
  LocationOn, 
  Description, 
  CheckCircle, 
  Calculate, 
  Refresh,
  Hotel
} from '@mui/icons-material';

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState(() => ({
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().split('T')[0],
    propertyName: 'Barod Fall Cottage',
    customerName: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    totalAmount: '',
    advanceAmount: '',
    paymentMode: 'UPI',
    notes: ''
  }));

  const [isPdfReady, setIsPdfReady] = useState(false);

  // Load fonts and html2pdf library
  useEffect(() => {
    // Load Fonts
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Gloock&family=Sora:wght@100..800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Load html2pdf
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => setIsPdfReady(true);
    document.body.appendChild(script);

    return () => {
      if(document.head.contains(link)) document.head.removeChild(link);
      if(document.body.contains(script)) document.body.removeChild(script);
    }
  }, []);

  // Calculate balance and nights (derived values)
  const calculateMetrics = () => {
    const start = new Date(invoiceData.checkIn);
    const end = new Date(invoiceData.checkOut);
    let nights = 0;

    if (invoiceData.checkIn && invoiceData.checkOut && !isNaN(start) && !isNaN(end)) {
      const diffTime = Math.abs(end - start);
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (nights === 0 && invoiceData.checkIn === invoiceData.checkOut) nights = 1; 
    }

    const total = parseFloat(invoiceData.totalAmount) || 0;
    const advance = parseFloat(invoiceData.advanceAmount) || 0;
    const balance = total - advance;

    return {
      nights: nights,
      balance: balance >= 0 ? balance : 0,
    };
  };

  const calculations = calculateMetrics();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setStandardAdvance = () => {
    const total = parseFloat(invoiceData.totalAmount);
    if (!isNaN(total)) {
      setInvoiceData(prev => ({
        ...prev,
        advanceAmount: Math.round(total * 0.30) // 30% Standard
      }));
    }
  };

  const generateNewInvoiceId = () => {
    setInvoiceData(prev => ({
      ...prev,
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000) + 1000}`
    }));
  };

  const handleDownload = () => {
    if (!window.html2pdf) {
      alert("PDF Generator is loading, please wait...");
      return;
    }

    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 0,
      filename: `${invoiceData.invoiceNumber}_${invoiceData.customerName.replace(/\s+/g, '_') || 'Guest'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save();
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', paddingBottom: 4, fontFamily: "'Sora', sans-serif" }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
        <Toolbar>
          <Hotel sx={{ mr: 2, color: '#ffca28' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: "'Sora', sans-serif" }}>
            Fernovo Stays Admin
          </Typography>
          <Button 
            variant="contained" 
            color="warning" 
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={!isPdfReady}
            sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
          >
            {isPdfReady ? 'Download PDF' : 'Loading...'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          
          {/* LEFT COLUMN: Controls */}
          <Grid item xs={12} md={5} lg={4}>
            
            {/* Booking Details Card */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.secondary', fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                <Description sx={{ mr: 1 }} /> Booking Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Property</InputLabel>
                    <Select
                      name="propertyName"
                      value={invoiceData.propertyName}
                      label="Select Property"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="Barod Fall Cottage">Barod Fall Cottage</MenuItem>
                      <MenuItem value="Saraswati Palace">Saraswati Palace</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                     <TextField
                      fullWidth
                      size="small"
                      label="Invoice Number"
                      name="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <Button variant="outlined" sx={{ minWidth: '50px' }} onClick={generateNewInvoiceId}>
                      <Refresh />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Invoice Date"
                    name="date"
                    value={invoiceData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      htmlInput: {
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Guest Info Card */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.secondary', fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                <Person sx={{ mr: 1 }} /> Guest Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Guest Name" name="customerName" value={invoiceData.customerName} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Phone Number" name="phone" value={invoiceData.phone} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Email Address" name="email" value={invoiceData.email} onChange={handleInputChange} />
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Card */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.secondary', fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                <CalendarToday sx={{ mr: 1 }} /> Stay & Payment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    type="date" 
                    label="Check In" 
                    name="checkIn" 
                    value={invoiceData.checkIn} 
                    onChange={handleInputChange} 
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      htmlInput: {
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    type="date" 
                    label="Check Out" 
                    name="checkOut" 
                    value={invoiceData.checkOut} 
                    onChange={handleInputChange} 
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      htmlInput: {
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Total Stay Amount" 
                    name="totalAmount" 
                    type="number"
                    value={invoiceData.totalAmount} 
                    onChange={handleInputChange} 
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Advance Payment</Typography>
                    <Button size="small" startIcon={<Calculate />} onClick={setStandardAdvance}>Auto 30%</Button>
                   </Box>
                   <TextField 
                    fullWidth 
                    name="advanceAmount" 
                    type="number"
                    value={invoiceData.advanceAmount} 
                    onChange={handleInputChange} 
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    color="success"
                    focused
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Mode of Payment</InputLabel>
                    <Select name="paymentMode" value={invoiceData.paymentMode} label="Mode of Payment" onChange={handleInputChange}>
                      <MenuItem value="UPI">UPI / GPay / PhonePe</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer (NEFT/IMPS)</MenuItem>
                      <MenuItem value="Card">Credit/Debit Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

          </Grid>

          {/* RIGHT COLUMN: Invoice Preview */}
          <Grid item xs={12} md={7} lg={8}>
            <Paper 
              id="invoice-content" 
              elevation={4} 
              sx={{ 
                p: 6, 
                minHeight: '1123px', 
                maxWidth: '794px', // A4 Width
                mx: 'auto',
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Sora', sans-serif"
              }}
            >
              {/* Header */}
              <Box sx={{ borderBottom: '2px solid #1a237e', pb: 3, mb: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontFamily: "'Gloock', serif", color: '#1a237e', textTransform: 'uppercase' }}>
                    Fernovo Stays
                  </Typography>
                  <Box sx={{ mt: 2, color: 'text.secondary' }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', fontFamily: "'Sora', sans-serif" }}>{invoiceData.propertyName}</Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: "'Sora', sans-serif" }}><LocationOn fontSize="small"/> Manali, Himachal Pradesh, India</Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: "'Sora', sans-serif" }}><Phone fontSize="small"/> +91 9011165894 | +91 7456031322</Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: "'Sora', sans-serif" }}><Email fontSize="small"/> fernovostays@gmail.com</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 2, border: '1px solid #bbdefb' }}>
                    <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 'bold', fontFamily: "'Gloock', serif" }}>INVOICE</Typography>
                    <Typography color="text.secondary" sx={{ fontFamily: "'Sora', sans-serif" }}>#{invoiceData.invoiceNumber}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Sora', sans-serif" }}>Date: {invoiceData.date}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Bill To */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#bdbdbd', textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Sora', sans-serif" }}>
                  Invoice To
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "'Sora', sans-serif" }}>
                  {invoiceData.customerName || 'Guest Name'}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "'Sora', sans-serif" }}>{invoiceData.phone}</Typography>
                <Typography variant="body2" sx={{ fontFamily: "'Sora', sans-serif" }}>{invoiceData.email}</Typography>
              </Box>

              {/* Table */}
              <TableContainer sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontFamily: "'Sora', sans-serif" }}>DESCRIPTION</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontFamily: "'Sora', sans-serif" }}>CHECK IN</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontFamily: "'Sora', sans-serif" }}>CHECK OUT</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary', fontFamily: "'Sora', sans-serif" }}>NIGHTS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ color: '#1a237e', fontWeight: 'bold', fontFamily: "'Sora', sans-serif" }}>Accommodation Charge</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Sora', sans-serif" }}>{invoiceData.propertyName}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Sora', sans-serif" }}>{invoiceData.checkIn}</TableCell>
                      <TableCell sx={{ fontFamily: "'Sora', sans-serif" }}>{invoiceData.checkOut}</TableCell>
                      <TableCell align="right" sx={{ fontFamily: "'Sora', sans-serif" }}>{calculations.nights}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Financials */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
                <Box sx={{ width: '50%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1 }}>
                    <Typography color="text.secondary" sx={{ fontFamily: "'Sora', sans-serif" }}>Total Amount</Typography>
                    <Typography variant="h6" sx={{ fontFamily: "'Sora', sans-serif" }}>₹{parseFloat(invoiceData.totalAmount || 0).toLocaleString()}</Typography>
                  </Box>
                  
                  <Paper variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1.5, bgcolor: '#e8f5e9', borderColor: '#c8e6c9', color: '#2e7d32' }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle fontSize="small" /> 
                        <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: "'Sora', sans-serif" }}>Advance Paid ({invoiceData.paymentMode})</Typography>
                     </Box>
                     <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "'Sora', sans-serif" }}>- ₹{parseFloat(invoiceData.advanceAmount || 0).toLocaleString()}</Typography>
                  </Paper>

                  <Divider sx={{ my: 2, borderColor: '#000' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#1a237e', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: "'Sora', sans-serif" }}>Balance Due</Typography>
                    <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 'bold', fontFamily: "'Sora', sans-serif" }}>₹{calculations.balance.toLocaleString()}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, color: 'text.secondary', fontFamily: "'Sora', sans-serif" }}>
                    *Prices are inclusive of applicable taxes.
                  </Typography>
                </Box>
              </Box>

              {/* Footer / Terms - Pushed to bottom */}
              <Box sx={{ mt: 'auto', borderTop: '1px solid #eee', pt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontFamily: "'Sora', sans-serif" }}>Terms & Conditions</Typography>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '10px', color: '#757575', textAlign: 'justify', fontFamily: "'Sora', sans-serif" }}>
                  <li style={{ marginBottom: '4px' }}>
                    <strong style={{ color: '#d32f2f' }}>Cancellation Policy:</strong> Booking fees and advance payments are strictly <strong>NON-REFUNDABLE</strong> upon cancellation under any circumstances.
                  </li>
                  <li style={{ marginBottom: '4px' }}><strong>Identification:</strong> All guests must present valid government-issued photo identification (Aadhar Card, Passport, Voter ID) upon check-in. PAN cards are not accepted.</li>
                  <li style={{ marginBottom: '4px' }}><strong>Check-in/Check-out:</strong> Standard Check-in: 12:00 PM | Check-out: 11:00 AM. Early/Late timings subject to availability and charges.</li>
                  <li style={{ marginBottom: '4px' }}><strong>Damages:</strong> Guests are responsible for any damage to property. Management reserves the right to charge for damages.</li>
                  <li><strong>Force Majeure:</strong> Fernovo Stays is not liable for service failure due to natural calamities (snow, landslides) or conditions beyond control.</li>
                </ul>

                <Box sx={{ mt: 6, pt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #eee' }}>
                   <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4, fontFamily: "'Sora', sans-serif" }}>Guest Signature</Typography>
                      <Divider sx={{ width: '150px' }} />
                   </Box>
                   <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontFamily: "'Gloock', serif", fontSize: '1.5rem', color: '#1a237e', opacity: 0.6, mb: 1 }}>Fernovo Stays</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontFamily: "'Sora', sans-serif" }}>Authorized Signatory</Typography>
                      <Divider sx={{ width: '150px' }} />
                   </Box>
                </Box>
                
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 4, color: '#bdbdbd', fontFamily: "'Sora', sans-serif" }}>
                  Thank you for choosing Fernovo Stays. We hope you had a pleasant stay! <br/> This is a system generated slip.
                </Typography>
              </Box>

            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}