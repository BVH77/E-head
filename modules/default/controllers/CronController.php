<?php

class CronController extends OSDN_Controller_Action
{
    public function scheduleAction()
    {
        $this->disableRender(true);

        $date = Zend_Date::now()->addDay(1)->get('dd.MM.YYYY');
        $config = Zend_Registry::get('config');
        $server = $config->mail->SMTP;

        $accounts = new OSDN_Accounts();
        $roles = new OSDN_Acl_Roles();

        // Send mail to production
        $roleId = $roles->alias2id('production');
        if ($roleId) {
            $persons = array();
            $response = $accounts->fetchByRole($roleId);
            if ($response->isSuccess()) {
                $rowset = $response->getRowset();
                foreach ($rowset as $row) {
                    if ($row['active'] == 1) {
                        $persons[] = array('email' => $row['email'], 'name' => $row['name']);
                    }
                }
            }
            if (!empty($persons)) {
                $mail = new Zend_Mail('UTF-8');
                $mail->setFrom($config->mail->from->address, $config->mail->from->caption);
                foreach ($persons as $person) {
                    $mail->addTo($person['email'], $person['name']);
                }
                $mail->setSubject("График производства на " . $date);
                $mail->setBodyHtml("http://$server/orders/report/schedule-production");
                try {
                    $mail->send();
                } catch (Exception $e) {
                    echo $e->getMessage();
                }
            }
        }

        // Send mail to print
        $roleId = $roles->alias2id('print');
        if ($roleId) {
            $persons = array();
            $response = $accounts->fetchByRole($roleId);
            if ($response->isSuccess()) {
                $rowset = $response->getRowset();
                foreach ($rowset as $row) {
                    if ($row['active'] == 1) {
                        $persons[] = array('email' => $row['email'], 'name' => $row['name']);
                    }
                }
            }
            if (!empty($persons)) {
                $mail = new Zend_Mail('UTF-8');
                $mail->setFrom($config->mail->from->address, $config->mail->from->caption);
                foreach ($persons as $person) {
                    $mail->addTo($person['email'], $person['name']);
                }
                $mail->setSubject("График печати на " . $date);
                $mail->setBodyHtml("http://$server/orders/report/schedule-print");
                try {
                    $mail->send();
                } catch (Exception $e) {
                    echo $e->getMessage();
                }
            }
        }

        // Send mail to mount
        $roleId = $roles->alias2id('mount');
        if ($roleId) {
            $persons = array();
            $response = $accounts->fetchByRole($roleId);
            if ($response->isSuccess()) {
                $rowset = $response->getRowset();
                foreach ($rowset as $row) {
                    if ($row['active'] == 1) {
                        $persons[] = array('email' => $row['email'], 'name' => $row['name']);
                    }
                }
            }
            if (!empty($persons)) {
                $mail = new Zend_Mail('UTF-8');
                $mail->setFrom($config->mail->from->address, $config->mail->from->caption);

                foreach ($persons as $person) {
                    $mail->addTo($person['email'], $person['name']);
                }
                $mail->setSubject("График монтажных работ на " . $date);
                $mail->setBodyHtml("http://$server/orders/report/schedule-mount");

                try {
                    $mail->send();
                } catch (Exception $e) {
                    echo $e->getMessage();
                }
            }
        }

        // отчёт по выплатам за день

        $report = new PMS_Staff_Reports();
        $data = $report->generatePays();
        if ($data->hasNotSuccess()) return;
        $this->view->assign('data', $data->getRowset());

        $a1 = $accounts->fetchByLogin('admin');
        if ($a1->hasNotSuccess()) return;
//        $a2 = $accounts->fetchByLogin('bvh_admin');
//        if ($a2->hasNotSuccess()) return;

        $r1 = $a1->getRow();
//        $r2 = $a2->getRow();

        $mail = new Zend_Mail('UTF-8');
        $mail->setFrom($config->mail->from->address, $config->mail->from->caption);
        $mail->addTo($r1['email'], $r1['name']);
//        $mail->addTo($r2['email'], $r2['name']);
        $mail->setSubject("Отчёт по выплатам за " . Zend_Date::now()->get('dd.MM.YYYY'));
        $mail->setBodyHtml($this->view->render('pays.phtml'));
        try {
            $mail->send();
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
}